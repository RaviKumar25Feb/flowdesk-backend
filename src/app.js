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

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes mounting
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
