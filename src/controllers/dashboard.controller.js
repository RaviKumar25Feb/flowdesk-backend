const dashboardService = require("../services/dashboard.service");

//manager get dashboard details for take overview
exports.getManagerDashboard = async (req, res) => {
  try {
    const dashboard = await dashboardService.getManagerDashboard();

    return res.status(200).json({
      success: true,
      message: "Manager dashboard fetched successfully",
      dashboard,
    });
  } catch (error) {
    console.error("Get Manager Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch manager dashboard.",
      error: error.message,
    });
  }
};
