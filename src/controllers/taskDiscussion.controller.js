const Task = require("../models/task.model");
const Project = require("../models/project.model");
const TaskDiscussion = require("../models/taskDiscussion.model");
const { ROLES } = require("../constants/roles");

//manager/developer create task discussion
exports.createTaskDiscussion = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { message } = req.body;

    // Get Task
    const task = await Task.findOne({
      _id: taskId,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // =======================
    // MANAGER
    // =======================

    if (req.user.role === ROLES.MANAGER) {
      const project = await Project.findOne({
        _id: task.project,
        manager: req.user.id,
        isArchived: false,
      });

      if (!project) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to discuss on this task.",
        });
      }
    }

    // =======================
    // DEVELOPER
    // =======================

    if (req.user.role === ROLES.DEVELOPER) {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to this task.",
        });
      }
    }

    // Create Discussion
    const discussion = await TaskDiscussion.create({
      task: task._id,
      user: req.user.id,
      message,
    });

    const populatedDiscussion = await TaskDiscussion.findById(discussion._id)
      .populate("user", "name email role")
      .populate("task", "title");

    return res.status(201).json({
      success: true,
      message: "Discussion added successfully.",
      data: populatedDiscussion,
    });
  } catch (error) {
    console.error("Create Task Discussion Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager/developer get task discussion
exports.getTaskDiscussions = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Check Task
    const task = await Task.findOne({
      _id: taskId,
      isDeleted: false,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    //======================
    // MANAGER
    //======================

    if (req.user.role === ROLES.MANAGER) {
      const project = await Project.findOne({
        _id: task.project,
        manager: req.user.id,
        isArchived: false,
      });

      if (!project) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view these discussions.",
        });
      }
    }

    //======================
    // DEVELOPER
    //======================

    if (req.user.role === ROLES.DEVELOPER) {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view these discussions.",
        });
      }
    }

    // Get Discussions
    const discussions = await TaskDiscussion.find({
      task: taskId,
      isDeleted: false,
    })
      .populate("user", "name role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: discussions.length,
      data: discussions,
    });
  } catch (error) {
    console.error("Get Task Discussions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager/developer update task discussion
exports.updateTaskDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { message } = req.body;

    // Get Discussions
    const discussion = await TaskDiscussion.findOne({
      _id: discussionId,
      isDeleted: false,
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found.",
      });
    }

    //=====================
    // MANAGER
    //=====================

    if (req.user.role === ROLES.MANAGER) {
      const task = await Task.findById(discussion.task);

      const project = await Project.findOne({
        _id: task.project,
        manager: req.user.id,
        isArchived: false,
      });

      if (!project) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this discussion.",
        });
      }
    }

    //=====================
    // DEVELOPER
    //=====================

    if (req.user.role === ROLES.DEVELOPER) {
      if (discussion.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You can update only your own discussions.",
        });
      }
    }

    discussion.message = message;
    discussion.isEdited = true;

    await discussion.save();

    return res.status(200).json({
      success: true,
      message: "Discussion updated successfully.",
      data: discussion,
    });
  } catch (error) {
    console.error("Update Task Discussion Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//manager/developer delete task discussion
exports.deleteTaskDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;

    // Get Discussions
    const discussion = await TaskDiscussion.findOne({
      _id: discussionId,
      isDeleted: false,
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found.",
      });
    }

    //======================
    // MANAGER
    //======================

    if (req.user.role === ROLES.MANAGER) {
      const task = await Task.findById(discussion.task);

      const project = await Project.findOne({
        _id: task.project,
        manager: req.user.id,
        isArchived: false,
      });

      if (!project) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this discussion.",
        });
      }
    }

    //======================
    // DEVELOPER
    //======================

    if (req.user.role === ROLES.DEVELOPER) {
      if (discussion.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You can delete only your own discussions.",
        });
      }
    }

    discussion.isDeleted = true;

    await discussion.save();

    return res.status(200).json({
      success: true,
      message: "Discussion deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Task Discussion Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
