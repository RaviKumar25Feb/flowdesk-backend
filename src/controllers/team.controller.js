const Project = require("../models/project.model");
const User = require("../models/user.model");
const { ROLES } = require("../constants/roles");

exports.assignDevelopers = async (req, res) => {
  try {
    const { projectId, developers } = req.body;

    // Check Project
    const project = await Project.findOne({
      _id: projectId,
      manager: req.user.id,
      isArchived: false,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Check Developers
    const existingDevelopers = await User.find({
      _id: { $in: developers },
      role: ROLES.DEVELOPER,
    });

    if (existingDevelopers.length !== developers.length) {
      return res.status(400).json({
        success: false,
        message: "One or more developers are invalid.",
      });
    }

    // Assign Developers (Ignore Duplicates)
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        $addToSet: {
          developers: {
            $each: developers,
          },
        },
      },
      {
        new: true,
      },
    )
      .populate("manager", "name email")
      .populate("client", "name email")
      .populate("developers", "name email");

    return res.status(200).json({
      success: true,
      message: "Developers assigned successfully.",
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

exports.getAssignedDevelopers = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findOne({
      _id: projectId,
      manager: req.user.id,
      isArchived: false,
    }).populate("developers", "name email profile");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      count: project.developers.length,
      data: project.developers,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.removeDeveloper = async (req, res) => {
  try {
    const { projectId, developerId } = req.params;

    // Check Project
    const project = await Project.findOne({
      _id: projectId,
      manager: req.user.id,
      isArchived: false,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Check Developer Assigned
    const isAssigned = project.developers.some(
      (id) => id.toString() === developerId,
    );

    if (!isAssigned) {
      return res.status(404).json({
        success: false,
        message: "Developer is not assigned to this project.",
      });
    }

    // Remove Developer
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        $pull: {
          developers: developerId,
        },
      },
      {
        new: true,
      },
    )
      .populate("manager", "name email")
      .populate("client", "name email")
      .populate("developers", "name email");

    return res.status(200).json({
      success: true,
      message: "Developer removed successfully.",
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
