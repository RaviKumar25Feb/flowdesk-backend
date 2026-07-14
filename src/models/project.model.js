const mongoose = require("mongoose");

const {
  PROJECT_STATUS,
  PROJECT_PRIORITY,
} = require("../constants/project.constants");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [3, "Project name must be at least 3 characters long"],
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [2000, "Project description cannot exceed 2000 characters"],
    },

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Manager is required"],
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client is required"],
    },

    developers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.PLANNING,
    },

    priority: {
      type: String,
      enum: Object.values(PROJECT_PRIORITY),
      default: PROJECT_PRIORITY.MEDIUM,
    },

    startDate: {
      type: Date,
      default: null,
    },

    deadline: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
projectSchema.index({ manager: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ developers: 1 });

module.exports = mongoose.model("Project", projectSchema);
