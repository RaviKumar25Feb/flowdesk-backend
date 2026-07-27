const Task = require("../models/task.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");
const { ROLES } = require("../constants/roles");
const { getTaskStatus } = require("../services/dashboard.service");

// for manager
exports.createTask = async (req, res) => {
  try {
    const managerId = req.user.id;

    const {
      title,
      description,
      project,
      assignedTo,
      priority,
      startDate,
      dueDate,
      estimatedHours,
    } = req.body;

    // Check Project
    const projectDetails = await Project.findOne({
      _id: project,
      manager: managerId,
      isArchived: false,
    });

    if (!projectDetails) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Check Developer
    const developer = await User.findOne({
      _id: assignedTo,
      role: ROLES.DEVELOPER,
    });

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: "Developer not found.",
      });
    }

    // Check Developer Assigned to Project
    const isAssigned = projectDetails.developers.some(
      (developerId) => developerId.toString() === assignedTo,
    );

    if (!isAssigned) {
      return res.status(400).json({
        success: false,
        message: "Developer is not assigned to this project.",
      });
    }

    // Date Validation
    if (startDate && dueDate) {
      if (new Date(dueDate) < new Date(startDate)) {
        return res.status(400).json({
          success: false,
          message: "Due date must be after start date.",
        });
      }
    }

    // Create Task
    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      createdBy: managerId,
      priority,
      startDate,
      dueDate,
      estimatedHours,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// for manager
exports.updateTask = async (req, res) => {
  try {
    const managerId = req.user.id;
    const { taskId } = req.params;

    const {
      title,
      description,
      assignedTo,
      priority,
      startDate,
      dueDate,
      estimatedHours,
    } = req.body;

    // Find Task
    const task = await Task.findById(taskId).populate("project");

    if (!task || task.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // Check Project Ownership
    if (task.project.manager.toString() !== managerId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this task.",
      });
    }

    // Validate Dates
    if (startDate && dueDate) {
      if (new Date(dueDate) < new Date(startDate)) {
        return res.status(400).json({
          success: false,
          message: "Due date must be after start date.",
        });
      }
    }

    // If Developer Changed
    if (assignedTo && assignedTo !== task.assignedTo.toString()) {
      const developer = await User.findOne({
        _id: assignedTo,
        role: ROLES.DEVELOPER,
      });

      if (!developer) {
        return res.status(404).json({
          success: false,
          message: "Developer not found.",
        });
      }

      const isAssigned = task.project.developers.some(
        (developerId) => developerId.toString() === assignedTo,
      );

      if (!isAssigned) {
        return res.status(400).json({
          success: false,
          message: "Developer is not assigned to this project.",
        });
      }

      task.assignedTo = assignedTo;
    }

    // Update Fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority) task.priority = priority;
    if (startDate) task.startDate = startDate;
    if (dueDate) task.dueDate = dueDate;
    if (estimatedHours !== undefined) {
      task.estimatedHours = estimatedHours;
    }

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Update Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// for developer
exports.updateTaskStatus = async (req, res) => {
  try {
    const developerId = req.user.id;
    const { taskId } = req.params;
    const { status } = req.body;

    // Find Task
    const task = await Task.findById(taskId);

    if (!task || task.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // Check Task Ownership
    if (task.assignedTo.toString() !== developerId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this task.",
      });
    }

    // Update Status
    task.status = status;

    if (status === "COMPLETED") {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Update Task Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// for manager
exports.deleteTask = async (req, res) => {
  try {
    const managerId = req.user.id;
    const { taskId } = req.params;

    // Find Task
    const task = await Task.findById(taskId).populate("project");

    if (!task || task.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // Check Project Ownership
    if (task.project.manager.toString() !== managerId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this task.",
      });
    }

    // Soft Delete
    task.isDeleted = true;
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// for developer
exports.getMyTasks = async (req, res) => {
  try {
    const developerId = req.user.id;

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
      assignedTo: developerId,
      isDeleted: false,
    };

    // Search by Task Title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by Status
    if (status) {
      filter.status = status;
    }

    // Filter by Priority
    if (priority) {
      filter.priority = priority;
    }

    // Allowed Sorting Fields
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "dueDate",
      "title",
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

    // Execute Queries in Parallel
    const [tasks, totalTasks] = await Promise.all([
      Task.find(filter)
        .populate("project", "name status priority deadline")
        .populate("createdBy", "name email")
        .sort(sort)
        .skip(skip)
        .limit(perPage)
        .lean(),

      Task.countDocuments(filter),
    ]);

    const totalPages = Math.max(Math.ceil(totalTasks / perPage), 1);

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully.",
      data: tasks,

      pagination: {
        currentPage,
        perPage,
        totalTasks,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Get My Tasks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// for manager
exports.getProjectTasks = async (req, res) => {
  try {
    const managerId = req.user.id;
    const { projectId } = req.params;

    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Check Project
    const project = await Project.findOne({
      _id: projectId,
      manager: managerId,
      isArchived: false,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Build Filter
    const filter = {
      project: projectId,
      isDeleted: false,
    };

    // Search by Task Title
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by Status
    if (status) {
      filter.status = status;
    }

    // Filter by Priority
    if (priority) {
      filter.priority = priority;
    }

    // Allowed Sorting Fields
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "dueDate",
      "title",
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

    // Fetch Tasks
    const [tasks, totalTasks] = await Promise.all([
      Task.find(filter)
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .sort(sort)
        .skip(skip)
        .limit(perPage)
        .lean(),

      Task.countDocuments(filter),
    ]);

    const totalPages = Math.max(Math.ceil(totalTasks / perPage), 1);

    return res.status(200).json({
      success: true,
      message: "Project tasks fetched successfully.",
      data: tasks,

      pagination: {
        currentPage,
        perPage,
        totalTasks,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Get Project Tasks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// for assigned developer
exports.getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { taskId } = req.params;

    // Find Task
    const task = await Task.findOne({
      _id: taskId,
      isDeleted: false,
    })
      .populate(
        "project",
        "name description status priority startDate deadline manager",
      )
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .lean();

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // Manager Access
    if (userRole === ROLES.MANAGER) {
      if (task.project.manager.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this task.",
        });
      }
    }

    // Developer Access
    if (userRole === ROLES.DEVELOPER) {
      if (task.assignedTo._id.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this task.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Task fetched successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Get Task By Id Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// for manager get all tasks
exports.getTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      project,
      status,
      priority,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const pageLimit = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * pageLimit;

    // Build Filter
    const filter = {
      isDeleted: false,
    };

    // Search
    if (search.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Project Filter
    if (project) {
      filter.project = project;
    }

    // Status Filter
    if (status) {
      filter.status = status;
    }

    // Priority Filter
    if (priority) {
      filter.priority = priority;
    }

    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "dueDate",
      "priority",
      "status",
      "title",
    ];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const sort = {
      [sortField]: order === "asc" ? 1 : -1,
    };

    const [tasks, totalTasks, overview] = await Promise.all([
      Task.find(filter)
        .select(
          "title description project assignedTo priority status dueDate createdAt",
        )
        .sort(sort)
        .skip(skip)
        .limit(pageLimit)
        .populate("project", "name")
        .populate({
          path: "assignedTo",
          select: "name profile",
          populate: {
            path: "profile",
            select: "avatar",
          },
        })
        .populate("createdBy", "name"),

      Task.countDocuments(filter),

      getTaskStatus(),
    ]);

    return res.status(200).json({
      success: true,
      overview,
      tasks,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalTasks / pageLimit),
        totalTasks,
        limit: pageLimit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
