const Task = require("../models/task.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");
const { ROLES } = require("../constants/roles");

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

exports.getProjectTasks = async (req, res) => {
  try {
    const managerId = req.user.id;
    const { projectId } = req.params;

    // Check Project
    const projectDetails = await Project.findById(projectId);

    if (!projectDetails) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Check Archived
    if (projectDetails.isArchived) {
      return res.status(400).json({
        success: false,
        message: "Project is archived.",
      });
    }

    // Check Ownership
    if (projectDetails.manager.toString() !== managerId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this project.",
      });
    }

    // Get Tasks
    const tasks = await Task.find({
      project: projectId,
      isDeleted: false,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Get Project Tasks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { taskId } = req.params;

    // Find Task
    const task = await Task.findById(taskId)
      .populate("project")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // Check Soft Delete
    if (task.isDeleted) {
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

exports.getMyTasks = async (req, res) => {
  try {
    const developerId = req.user.id;

    const tasks = await Task.find({
      assignedTo: developerId,
      isDeleted: false,
    })
      .populate("project", "name status priority deadline")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Get My Tasks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
