const Project = require("../models/project.model");
const Task = require("../models/task.model");
const User = require("../models/user.model");
const { TASK_STATUS } = require("../constants/task.constants");
const { PROJECT_STATUS } = require("../constants/project.constants");
const { ROLES } = require("../constants/roles");

async function getOverview() {
  const [
    totalProjects,
    inProgressProjects,
    testingProjects,
    completedProjects,
    onHoldProjects,
    cancelledProjects,
    archivedProjects,

    totalTasks,

    totalDevelopers,
    totalClients,
  ] = await Promise.all([
    // Projects
    Project.countDocuments({
      isArchived: false,
    }),

    Project.countDocuments({
      isArchived: false,
      status: PROJECT_STATUS.IN_PROGRESS,
    }),

    Project.countDocuments({
      isArchived: false,
      status: PROJECT_STATUS.TESTING,
    }),

    Project.countDocuments({
      isArchived: false,
      status: PROJECT_STATUS.COMPLETED,
    }),

    Project.countDocuments({
      isArchived: false,
      status: PROJECT_STATUS.ON_HOLD,
    }),

    Project.countDocuments({
      isArchived: false,
      status: PROJECT_STATUS.CANCELLED,
    }),

    Project.countDocuments({
      isArchived: true,
    }),

    // Tasks
    Task.countDocuments({
      isDeleted: false,
    }),

    // Developers
    User.countDocuments({
      role: ROLES.DEVELOPER,
      isActive: true,
    }),

    // Clients
    User.countDocuments({
      role: ROLES.CLIENT,
      isActive: true,
    }),
  ]);

  return {
    totalProjects,
    activeProjects: inProgressProjects + testingProjects,
    completedProjects,
    onHoldProjects,
    cancelledProjects,
    archivedProjects,

    totalTasks,

    totalDevelopers,
    totalClients,
  };
}

async function getTaskStatus() {
  const taskStatus = {
    total: 0,
    todo: 0,
    inProgress: 0,
    inReview: 0,
    completed: 0,
  };

  const result = await Task.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  const statusMap = {
    [TASK_STATUS.TODO]: "todo",
    [TASK_STATUS.IN_PROGRESS]: "inProgress",
    [TASK_STATUS.IN_REVIEW]: "inReview",
    [TASK_STATUS.COMPLETED]: "completed",
  };

  for (const item of result) {
    taskStatus.total += item.count;

    const key = statusMap[item._id];

    if (key) {
      taskStatus[key] = item.count;
    }
  }

  return taskStatus;
}

async function getRecentProjects() {
  const recentProjects = await Project.find({
    isArchived: false,
  })
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate("client", "name")
    .select("name client status updatedAt");

  return recentProjects;
}

async function getRecentTasks() {
  const recentTasks = await Task.find({
    isDeleted: false,
  })
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate("project", "name")
    .populate({
      path: "assignedTo",
      select: "name profile",
      populate: {
        path: "profile",
        select: "avatar",
      },
    })
    .select("title project assignedTo status priority dueDate updatedAt");

  return recentTasks;
}

async function getUpcomingDeadlines() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const upcomingDeadlines = await Task.find({
    isDeleted: false,
    status: {
      $ne: TASK_STATUS.COMPLETED,
    },
    dueDate: {
      $gte: today,
    },
  })
    .sort({
      dueDate: 1,
    })
    .limit(5)
    .populate("project", "name")
    .populate("assignedTo", "name")
    .select("title project assignedTo priority status dueDate");

  return upcomingDeadlines;
}

async function getManagerDashboard() {
  const [overview, taskStatus, recentProjects, recentTasks, upcomingDeadlines] =
    await Promise.all([
      getOverview(),
      getTaskStatus(),
      getRecentProjects(),
      getRecentTasks(),
      getUpcomingDeadlines(),
    ]);

  return {
    overview,
    taskStatus,
    recentProjects,
    recentTasks,
    upcomingDeadlines,
  };
}

module.exports = {
  getManagerDashboard,
  getTaskStatus
};
