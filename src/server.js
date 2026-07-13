require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;
const { cloudinaryConnect } = require("./config/cloudinary.config");

const startServer = async () => {
  try {
    await connectDB();
    cloudinaryConnect();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server");
    console.error(error);
  }
};

startServer();
