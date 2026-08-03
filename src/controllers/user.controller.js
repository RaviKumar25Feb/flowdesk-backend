const crypto = require("crypto");
const Project = require("../models/project.model");
const Task = require("../models/task.model");
const { TASK_STATUS } = require("../constants/task.constants");
const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const { PROJECT_STATUS } = require("../constants/project.constants");
const { ROLES } = require("../constants/roles");
const { mailSender } = require("../utils/mailSender");
const { accountCreatedTemplate } = require("../mails/accountCreated");
const { accountDeactivatedTemplate } = require("../mails/accountDeactivated");

//manager create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Only Developer & Client can be created
    if (![ROLES.DEVELOPER, ROLES.CLIENT].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Generate Random Password
    const password = crypto.randomBytes(6).toString("base64");

    // Create User
    const user = await User.create({
      name,
      email,
      password, // Automatically hashed by pre("save")
      role,
    });

    // Create Profile
    const profile = await Profile.create({
      user: user._id,
    });

    // Link Profile to User
    user.profile = profile._id;
    await user.save();

    // Send Welcome Email
    await mailSender(
      user.email,
      "Welcome to FlowDesk",
      accountCreatedTemplate(user.name, user.email, password),
    );

    return res.status(201).json({
      success: true,
      message: `${role} created successfully.`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Create User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager update user
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, isActive } = req.body;

    // Check User
    const user = await User.findOne({
      _id: userId,
      role: {
        $in: [ROLES.DEVELOPER, ROLES.CLIENT],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check Duplicate Email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already exists.",
        });
      }
    }

    // Update Fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager deactivate user
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      _id: userId,
      role: {
        $in: [ROLES.DEVELOPER, ROLES.CLIENT],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "User is already inactive.",
      });
    }

    user.isActive = false;

    await user.save();

    try {
      await mailSender(
        user.email,
        "FlowDesk Account Deactivated",
        accountDeactivatedTemplate(user.name),
      );
    } catch (error) {
      console.log("Failed to send deactivation email:", error.message);
    }

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully.",
    });
  } catch (error) {
    console.error("Deactivate User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager actiavte user
exports.activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      _id: userId,
      role: {
        $in: [ROLES.DEVELOPER, ROLES.CLIENT],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isActive) {
      return res.status(400).json({
        success: false,
        message: "User is already active.",
      });
    }

    user.isActive = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User activated successfully.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Activate User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager get all users for users page
exports.getAllUsers = async (req, res) => {
  try {
    const {
      role,
      search,
      isActive,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // ============================
    // Build Filter
    // ============================

    const filter = {};

    if (role) {
      if (![ROLES.DEVELOPER, ROLES.CLIENT].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role.",
        });
      }

      filter.role = role;
    } else {
      filter.role = {
        $in: [ROLES.DEVELOPER, ROLES.CLIENT],
      };
    }

    // Search by name or email
    if (search?.trim()) {
      const searchText = search.trim();

      filter.$or = [
        {
          name: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          email: {
            $regex: searchText,
            $options: "i",
          },
        },
      ];
    }

    // Active / Inactive filter
    if (isActive !== undefined) {
      if (!["true", "false"].includes(isActive)) {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false.",
        });
      }

      filter.isActive = isActive === "true";
    }

    // ============================
    // Sorting
    // ============================

    const allowedSortFields = ["createdAt", "updatedAt", "name", "email"];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    // ============================
    // Pagination
    // ============================

    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);

    // Avoid accidentally fetching thousands of users
    const perPage = Math.min(
      Math.max(Number.parseInt(limit, 10) || 10, 1),
      1000,
    );

    const skip = (currentPage - 1) * perPage;

    // ============================
    // Fetch Users
    // ============================

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("_id name email role isActive profile createdAt updatedAt")
        .populate({
          path: "profile",
          select:
            "avatar phone designation department skills github linkedin portfolio",
        })
        .sort({
          [sortField]: sortOrder,
        })
        .skip(skip)
        .limit(perPage)
        .lean(),

      User.countDocuments(filter),
    ]);

    // ============================
    // Prepare Response
    // ============================

    const data = await Promise.all(
      users.map(async (user) => {
        const projectsCount = await Project.countDocuments({
          isArchived: false,

          ...(user.role === ROLES.DEVELOPER
            ? {
                developers: user._id,
              }
            : {
                client: user._id,
              }),
        });

        // Client doesn't need task statistics
        if (user.role === ROLES.CLIENT) {
          return {
            ...user,
            projectsCount,
          };
        }

        const [assignedTasks, completedTasks] = await Promise.all([
          Task.countDocuments({
            assignedTo: user._id,
            isDeleted: false,
          }),

          Task.countDocuments({
            assignedTo: user._id,
            status: TASK_STATUS.COMPLETED,
            isDeleted: false,
          }),
        ]);

        return {
          ...user,
          projectsCount,
          assignedTasks,
          completedTasks,
        };
      }),
    );

    const totalPages = Math.max(Math.ceil(totalUsers / perPage), 1);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data,
      pagination: {
        currentPage,
        perPage,
        totalUsers,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager get user details for user detail page
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch User
    const user = await User.findOne({
      _id: userId,
      role: {
        $in: [ROLES.DEVELOPER, ROLES.CLIENT],
      },
    })
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("profile")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ============================
    // Developer Details
    // ============================
    if (user.role === ROLES.DEVELOPER) {
      const [projects, taskStats, recentTasks] = await Promise.all([
        Project.find({
          developers: user._id,
          isArchived: false,
        })
          .select("name status priority deadline")
          .lean(),

        Task.aggregate([
          {
            $match: {
              assignedTo: user._id,
              isDeleted: false,
            },
          },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]),

        Task.find({
          assignedTo: user._id,
          isDeleted: false,
        })
          .sort({ updatedAt: -1 })
          .limit(5)
          .populate("project", "name")
          .select("title status priority dueDate updatedAt project")
          .lean(),
      ]);

      const overview = {
        projectsCount: projects.length,
        assignedTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        inReviewTasks: 0,
      };

      taskStats.forEach((item) => {
        overview.assignedTasks += item.count;

        switch (item._id) {
          case TASK_STATUS.TODO:
            overview.pendingTasks = item.count;
            break;

          case TASK_STATUS.IN_PROGRESS:
            overview.inProgressTasks = item.count;
            break;

          case TASK_STATUS.IN_REVIEW:
            overview.inReviewTasks = item.count;
            break;

          case TASK_STATUS.COMPLETED:
            overview.completedTasks = item.count;
            break;
        }
      });

      return res.status(200).json({
        success: true,
        message: "Developer fetched successfully.",
        data: {
          user,
          overview,
          projects,
          recentTasks,
        },
      });
    }

    // ============================
    // Client Details
    // ============================

    const projects = await Project.find({
      client: user._id,
      isArchived: false,
    })
      .select(
        "name status priority startDate deadline developers createdAt updatedAt",
      )
      .populate({
        path: "developers",
        select: "name email profile",
        populate: {
          path: "profile",
          select: "avatar designation",
        },
      })
      .lean();

    // Project statistics
    const overview = {
      projectsCount: projects.length,
      activeProjects: 0,
      completedProjects: 0,
      onHoldProjects: 0,
      planningProjects: 0,
      testingProjects: 0,
      cancelledProjects: 0,
    };

    projects.forEach((project) => {
      switch (project.status) {
        case PROJECT_STATUS.PLANNING:
          overview.planningProjects += 1;
          break;

        case PROJECT_STATUS.IN_PROGRESS:
          overview.activeProjects += 1;
          break;

        case PROJECT_STATUS.TESTING:
          overview.testingProjects += 1;
          break;

        case PROJECT_STATUS.ON_HOLD:
          overview.onHoldProjects += 1;
          break;

        case PROJECT_STATUS.COMPLETED:
          overview.completedProjects += 1;
          break;

        case PROJECT_STATUS.CANCELLED:
          overview.cancelledProjects += 1;
          break;

        default:
          break;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Client fetched successfully.",
      data: {
        user,
        overview,
        projects,
      },
    });
  } catch (error) {
    console.error("Get User By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Developer overview
exports.getDevelopersOverview = async (req, res) => {
  try {
    const [totalDevelopers, activeDevelopers, inactiveDevelopers] =
      await Promise.all([
        User.countDocuments({
          role: ROLES.DEVELOPER,
        }),

        User.countDocuments({
          role: ROLES.DEVELOPER,
          isActive: true,
        }),

        User.countDocuments({
          role: ROLES.DEVELOPER,
          isActive: false,
        }),
      ]);

    return res.status(200).json({
      success: true,
      message: "Developers overview fetched successfully.",
      data: {
        totalDevelopers,
        activeDevelopers,
        inactiveDevelopers,
      },
    });
  } catch (error) {
    console.error("Get Developers Overview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// Client overview
exports.getClientsOverview = async (req, res) => {
  try {
    const [totalClients, activeClients, inactiveClients] = await Promise.all([
      User.countDocuments({
        role: ROLES.CLIENT,
      }),

      User.countDocuments({
        role: ROLES.CLIENT,
        isActive: true,
      }),

      User.countDocuments({
        role: ROLES.CLIENT,
        isActive: false,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Clients overview fetched successfully.",
      data: {
        totalClients,
        activeClients,
        inactiveClients,
      },
    });
  } catch (error) {
    console.error("Get Clients Overview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
