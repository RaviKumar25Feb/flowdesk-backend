const mongoose = require("mongoose");
const dns = require("node:dns/promises");

const connectDB = async () => {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
