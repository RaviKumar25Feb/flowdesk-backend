const Task = require("../models/task.model");
const Project = require("../models/project.model");
const TaskComment = require("../models/taskComment.model");
const { ROLES } = require("../constants/roles");

exports.createTaskComment = async (req, res) => {
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
        isDeleted: false,
      });

      if (!project) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to comment on this task.",
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

    // Create Comment
    const comment = await TaskComment.create({
      task: task._id,
      user: req.user.id,
      message,
    });

    const populatedComment = await TaskComment.findById(comment._id)
      .populate("user", "name email role")
      .populate("task", "title");

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      data: populatedComment,
    });
  } catch (error) {
    console.error("Create Task Comment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.getTaskComments = async (req, res) => {
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
        isDeleted: false,
      });

      if (!project) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view these comments.",
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
          message: "You are not authorized to view these comments.",
        });
      }
    }

    // Get Comments
    const comments = await TaskComment.find({
      task: taskId,
      isDeleted: false,
    })
      .populate("user", "name role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Get Task Comments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.updateTaskComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { message } = req.body;

    // Get Comment
    const comment = await TaskComment.findOne({
      _id: commentId,
      isDeleted: false,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    //=====================
    // MANAGER
    //=====================

    if (req.user.role === ROLES.MANAGER) {
      const task = await Task.findById(comment.task);

      const project = await Project.findOne({
        _id: task.project,
        manager: req.user.id,
        isDeleted: false,
      });

      if (!project) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this comment.",
        });
      }
    }

    //=====================
    // DEVELOPER
    //=====================

    if (req.user.role === ROLES.DEVELOPER) {
      if (comment.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You can update only your own comments.",
        });
      }
    }

    comment.message = message;
    comment.isEdited = true;

    await comment.save();

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
      data: comment,
    });
  } catch (error) {
    console.error("Update Task Comment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.deleteTaskComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Get Comment
    const comment = await TaskComment.findOne({
      _id: commentId,
      isDeleted: false,
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    //======================
    // MANAGER
    //======================

    if (req.user.role === ROLES.MANAGER) {
      const task = await Task.findById(comment.task);

      const project = await Project.findOne({
        _id: task.project,
        manager: req.user.id,
        isDeleted: false,
      });

      if (!project) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this comment.",
        });
      }
    }

    //======================
    // DEVELOPER
    //======================

    if (req.user.role === ROLES.DEVELOPER) {
      if (comment.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You can delete only your own comments.",
        });
      }
    }

    comment.isDeleted = true;

    await comment.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Task Comment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
