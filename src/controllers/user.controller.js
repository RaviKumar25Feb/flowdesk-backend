const crypto = require("crypto");
const Project = require("../models/project.model");
const Task = require("../models/task.model");
const { TASK_STATUS } = require("../constants/task.constants");
const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const { ROLES } = require("../constants/roles");
const { mailSender } = require("../utils/mailSender");
const { accountCreatedTemplate } = require("../mails/accountCreated");
const { accountDeactivatedTemplate } = require("../mails/accountDeactivated");

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

exports.deleteUser = async (req, res) => {
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
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

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

    // Build Filter
    const filter = {};

    // Role Filter
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

    // Search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Active Filter
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    // Sorting
    const allowedSortFields = ["createdAt", "updatedAt", "name", "email"];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const sort = {
      [sortField]: order === "asc" ? 1 : -1,
    };

    // Pagination
    const currentPage = Math.max(parseInt(page), 1);
    const perPage = Math.max(parseInt(limit), 1);

    const skip = (currentPage - 1) * perPage;

    // Fetch Users
    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("-password -resetPasswordToken -resetPasswordExpires")
        .populate("profile")
        .sort(sort)
        .skip(skip)
        .limit(perPage)
        .lean(),

      User.countDocuments(filter),
    ]);

    // Prepare Response
    const data = await Promise.all(
      users.map(async (user) => {
        const projectsCount = await Project.countDocuments({
          isArchived: false,
          ...(user.role === ROLES.DEVELOPER
            ? { developers: user._id }
            : { client: user._id }),
        });

        // Client doesn't need task summary
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
      .select("name status priority startDate deadline developers")
      .lean();

    const overview = {
      projectsCount: projects.length,
    };

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
