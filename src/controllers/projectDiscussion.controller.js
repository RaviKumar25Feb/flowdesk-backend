const Project = require("../models/project.model");
const ProjectDiscussion = require("../models/projectDiscussion.model");
const { ROLES } = require("../constants/roles");

exports.createProjectDiscussion = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message } = req.body;

    // Check Project
    const project = await Project.findOne({
      _id: projectId,
      isArchived: false,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    //======================
    // MANAGER
    //======================

    if (req.user.role === ROLES.MANAGER) {
      if (project.manager.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to add discussion to this project.",
        });
      }
    }

    //======================
    // CLIENT
    //======================

    if (req.user.role === ROLES.CLIENT) {
      if (project.client.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to add discussion to this project.",
        });
      }
    }

    // Create Discussion
    const discussion = await ProjectDiscussion.create({
      project: project._id,
      user: req.user.id,
      message,
    });

    const populatedDiscussion = await ProjectDiscussion.findById(
      discussion._id,
    ).populate("user", "name role");

    return res.status(201).json({
      success: true,
      message: "Discussion added successfully.",
      data: populatedDiscussion,
    });
  } catch (error) {
    console.error("Create Project Discussion Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.getProjectDiscussions = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check Project
    const project = await Project.findOne({
      _id: projectId,
      isArchived: false,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    //======================
    // MANAGER
    //======================

    if (req.user.role === ROLES.MANAGER) {
      if (project.manager.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to view discussions of this project.",
        });
      }
    }

    //======================
    // CLIENT
    //======================

    if (req.user.role === ROLES.CLIENT) {
      if (project.client.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to view discussions of this project.",
        });
      }
    }

    // Get Discussions
    const discussions = await ProjectDiscussion.find({
      project: projectId,
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
    console.error("Get Project Discussions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.updateProjectDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { message } = req.body;

    // Check Discussion
    const discussion = await ProjectDiscussion.findOne({
      _id: discussionId,
      isDeleted: false,
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found.",
      });
    }

    // Only discussion owner can update
    if (discussion.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this discussion.",
      });
    }

    // Update Discussion
    discussion.message = message;
    discussion.isEdited = true;

    await discussion.save();

    return res.status(200).json({
      success: true,
      message: "Discussion updated successfully.",
      data: discussion,
    });
  } catch (error) {
    console.error("Update Project Discussion Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.deleteProjectDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;

    // Check Discussion
    const discussion = await ProjectDiscussion.findOne({
      _id: discussionId,
      isDeleted: false,
    });

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found.",
      });
    }

    // ======================
    // MANAGER
    // ======================

    if (req.user.role === ROLES.MANAGER) {
      const project = await Project.findOne({
        _id: discussion.project,
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

    // ======================
    // CLIENT
    // ======================

    if (req.user.role === ROLES.CLIENT) {
      if (discussion.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You can delete only your own discussions.",
        });
      }
    }

    // Soft Delete
    discussion.isDeleted = true;

    await discussion.save();

    return res.status(200).json({
      success: true,
      message: "Discussion deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Project Discussion Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

