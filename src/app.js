const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// import routes
const authRoutes = require("./routes/auth.routes.js");
const profileRoutes = require("./routes/profile.routes");
const projectRoutes = require("./routes/project.routes");
const teamRoutes = require("./routes/team.routes");
const taskRoutes = require("./routes/task.routes");
const userRoutes = require("./routes/user.routes");
const taskComment = require("./routes/taskDiscussion.routes.js");
const projectDiscussionRoutes = require("./routes/projectDiscussion.routes");
const dashboardRoutes = require("./routes/dashboard.routes.js");

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://flowdesk-manager-web.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes mounting
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/taskComment", taskComment);
app.use("/api/v1/projectDiscussion", projectDiscussionRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
