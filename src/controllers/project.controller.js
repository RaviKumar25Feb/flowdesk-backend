const Project = require("../models/project.model");
const User = require("../models/user.model");
const { ROLES } = require("../constants/roles");
const Task = require("../models/task.model");
const { TASK_STATUS } = require("../constants/task.constants");

//manager create project
exports.createProject = async (req, res) => {
  try {
    // Get Data
    const { name, description, client, priority, startDate, deadline } =
      req.body;

    // Check Client Exists
    const existingClient = await User.findById(client);

    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    // Check Client Role
    if (existingClient.role !== ROLES.CLIENT) {
      return res.status(400).json({
        success: false,
        message: "Invalid client selected.",
      });
    }

    // Business Validation
    const start = new Date(startDate);
    const end = new Date(deadline);

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "Deadline must be after the start date.",
      });
    }

    // Create Project
    const project = await Project.create({
      name,
      description,
      manager: req.user.id,
      client,
      priority,
      startDate,
      deadline,
    });

    // Fetch Complete Project
    const createdProject = await Project.findById(project._id)
      .populate("manager", "name email")
      .populate("client", "name email");

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: createdProject,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager get all projects for projects page
exports.getProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build Filter
    const filter = {
      manager: req.user.id,
      isArchived: false,
    };

    // Search
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Status Filter
    if (status) {
      filter.status = status;
    }

    // Priority Filter
    if (priority) {
      filter.priority = priority;
    }

    // Sorting
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "deadline",
      "name",
      "priority",
      "status",
    ];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const sort = {
      [sortField]: order === "asc" ? 1 : -1,
    };

    const currentPage = Math.max(parseInt(page), 1);
    const perPage = Math.max(parseInt(limit), 1);

    const skip = (currentPage - 1) * perPage;

    // Fetch projects
    const [projects, totalProjects] = await Promise.all([
      Project.find(filter)
        .select(
          "name description client developers status priority deadline createdAt updatedAt",
        )
        .populate("client", "name")
        .populate({
          path: "developers",
          select: "name profile",
          populate: {
            path: "profile",
            select: "avatar",
          },
        })
        .sort(sort)
        .skip(skip)
        .limit(perPage)
        .lean(),

      Project.countDocuments(filter),
    ]);

    // Get project ids
    const projectIds = projects.map((project) => project._id);

    // Task statistics
    const taskStats = await Task.aggregate([
      {
        $match: {
          project: { $in: projectIds },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$project",
          totalTasks: {
            $sum: 1,
          },
          completedTasks: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", TASK_STATUS.COMPLETED],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // Convert aggregation into map
    const taskMap = {};

    taskStats.forEach((item) => {
      taskMap[item._id.toString()] = item;
    });

    // Final Response
    const formattedProjects = projects.map((project) => {
      const stats = taskMap[project._id.toString()] || {
        totalTasks: 0,
        completedTasks: 0,
      };

      const progress =
        stats.totalTasks > 0
          ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
          : 0;

      return {
        _id: project._id,
        name: project.name,
        description: project.description,
        client: project.client,
        developersPreview: project.developers.slice(0, 3),
        developersCount: project.developers.length,
        status: project.status,
        priority: project.priority,
        deadline: project.deadline,
        totalTasks: stats.totalTasks,
        completedTasks: stats.completedTasks,
        progress,
        updatedAt: project.updatedAt,
        createdAt: project.createdAt,
      };
    });

    const totalPages = Math.max(Math.ceil(totalProjects / perPage), 1);

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully.",
      data: formattedProjects,

      pagination: {
        currentPage,
        perPage,
        totalProjects,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager get archived projects for projects page
exports.getArchivedProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      priority,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build Filter
    const filter = {
      manager: req.user.id,
      isArchived: true,
    };

    // Search
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Priority Filter
    if (priority) {
      filter.priority = priority;
    }

    // Sorting
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "deadline",
      "name",
      "priority",
      "status",
    ];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const sort = {
      [sortField]: order === "asc" ? 1 : -1,
    };

    const currentPage = Math.max(parseInt(page), 1);
    const perPage = Math.max(parseInt(limit), 1);

    const skip = (currentPage - 1) * perPage;

    // Fetch Projects
    const [projects, totalProjects] = await Promise.all([
      Project.find(filter)
        .select(
          "name description client developers status priority deadline createdAt updatedAt",
        )
        .populate("client", "name")
        .populate({
          path: "developers",
          select: "name profile",
          populate: {
            path: "profile",
            select: "avatar",
          },
        })
        .sort(sort)
        .skip(skip)
        .limit(perPage)
        .lean(),

      Project.countDocuments(filter),
    ]);

    // Project IDs
    const projectIds = projects.map((project) => project._id);

    // Task Statistics
    const taskStats = await Task.aggregate([
      {
        $match: {
          project: { $in: projectIds },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$project",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", TASK_STATUS.COMPLETED] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Task Map
    const taskMap = {};

    taskStats.forEach((item) => {
      taskMap[item._id.toString()] = item;
    });

    // Final Response
    const formattedProjects = projects.map((project) => {
      const stats = taskMap[project._id.toString()] || {
        totalTasks: 0,
        completedTasks: 0,
      };

      const progress =
        stats.totalTasks > 0
          ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
          : 0;

      return {
        _id: project._id,
        name: project.name,
        description: project.description,
        client: project.client,
        developersPreview: project.developers.slice(0, 3),
        developersCount: project.developers.length,
        status: project.status,
        priority: project.priority,
        deadline: project.deadline,
        totalTasks: stats.totalTasks,
        completedTasks: stats.completedTasks,
        progress,
        updatedAt: project.updatedAt,
        createdAt: project.createdAt,
      };
    });

    const totalPages = Math.max(Math.ceil(totalProjects / perPage), 1);

    return res.status(200).json({
      success: true,
      message: "Archived projects fetched successfully.",
      data: formattedProjects,
      pagination: {
        currentPage,
        perPage,
        totalProjects,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager get project details for project details page
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch Project
    const project = await Project.findOne({
      _id: id,
      manager: req.user.id,
      isArchived: false,
    })
      .populate("manager", "name email")
      .populate({
        path: "client",
        select: "name email profile",
        populate: {
          path: "profile",
          select: "avatar",
        },
      })
      .populate({
        path: "developers",
        select: "name email profile",
        populate: {
          path: "profile",
          select: "avatar",
        },
      })
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Fetch Task Summary & Recent Tasks
    const [taskStats, recentTasks] = await Promise.all([
      Task.aggregate([
        {
          $match: {
            project: project._id,
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
        project: project._id,
        isDeleted: false,
      })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate("assignedTo", "name")
        .select("title assignedTo priority status dueDate updatedAt")
        .lean(),
    ]);

    // Prepare Overview
    const overview = {
      developersCount: project.developers.length,

      totalTasks: 0,

      todoTasks: 0,

      inProgressTasks: 0,

      inReviewTasks: 0,

      completedTasks: 0,

      remainingTasks: 0,

      progress: 0,
    };

    taskStats.forEach((item) => {
      overview.totalTasks += item.count;

      switch (item._id) {
        case TASK_STATUS.TODO:
          overview.todoTasks = item.count;
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

    overview.remainingTasks = overview.totalTasks - overview.completedTasks;

    if (overview.totalTasks > 0) {
      overview.progress = Math.round(
        (overview.completedTasks / overview.totalTasks) * 100,
      );
    }

    return res.status(200).json({
      success: true,
      message: "Project details fetched successfully.",
      data: {
        project,
        overview,
        recentTasks,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, priority, status, startDate, deadline } =
      req.body;

    const project = await Project.findOne({
      _id: id,
      manager: req.user.id,
      isArchived: false,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Date Validation
    const projectStartDate = startDate || project.startDate;
    const projectDeadline = deadline || project.deadline;

    if (new Date(projectDeadline) <= new Date(projectStartDate)) {
      return res.status(400).json({
        success: false,
        message: "Deadline must be after the start date.",
      });
    }

    // Update Fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (priority) project.priority = priority;
    if (status) project.status = status;
    if (startDate) project.startDate = startDate;
    if (deadline) project.deadline = deadline;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("manager", "name email")
      .populate("client", "name email");

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: updatedProject,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager archive a project
exports.archiveProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      manager: req.user.id,
      isArchived: false,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    project.isArchived = true;

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager restore a project
exports.restoreProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find archived project
    const project = await Project.findOne({
      _id: projectId,
      manager: req.user.id,
      isArchived: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Archived project not found.",
      });
    }

    // Restore project
    project.isArchived = false;
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project restored successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager getting all projects names for creating task to it
exports.getProjectOptions = async (req, res) => {
  try {
    const projects = await Project.find({
      manager: req.user.id,
      isArchived: false,
      status: { $ne: "CANCELLED" },
    })
      .select("_id name")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: "Project options fetched successfully.",
      data: projects,
    });
  } catch (error) {
    console.error("Get Project Options Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
