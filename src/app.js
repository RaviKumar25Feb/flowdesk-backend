const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const testRoutes = require("./routes/test.routes");
const authRoutes = require("./routes/auth.routes.js");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api", testRoutes);
app.use("/api/auth", authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
