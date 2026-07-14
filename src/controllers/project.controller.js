const Project = require("../models/project.model");
const User = require("../models/user.model");
const { ROLES } = require("../constants/roles");

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

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      manager: req.user.id,
      isArchived: false,
    })
      .populate("client", "name email")
      .populate("manager", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      manager: req.user.id,
      isArchived: false,
    })
      .populate("manager", "name email")
      .populate("client", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

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

exports.deleteProject = async (req, res) => {
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
