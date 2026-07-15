const crypto = require("crypto");
const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const { ROLES } = require("../constants/roles");
const { mailSender } = require("../utils/mailSender");
const { accountCreatedTemplate } = require("../mails/accountCreated");
const { accountDeactivatedTemplate } = require("../mails/accountDeactivated");

exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Only Developer & Client can be created
    if (![ROLES.DEVELOPER, ROLES.CLIENT].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Generate Random Password
    const password = crypto.randomBytes(6).toString("base64");

    // Create User
    const user = await User.create({
      name,
      email,
      password, // Automatically hashed by pre("save")
      role,
    });

    // Create Profile
    const profile = await Profile.create({
      user: user._id,
    });

    // Link Profile to User
    user.profile = profile._id;
    await user.save();

    // Send Welcome Email
    await mailSender(
      user.email,
      "Welcome to FlowDesk",
      accountCreatedTemplate(user.name, user.email, password),
    );

    return res.status(201).json({
      success: true,
      message: `${role} created successfully.`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Create User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: {
        $in: [ROLES.DEVELOPER, ROLES.CLIENT],
      },
    })
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("profile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      _id: userId,
      role: {
        $in: [ROLES.DEVELOPER, ROLES.CLIENT],
      },
    })
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("profile");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Get User By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const { name, email, isActive } = req.body;

    // Check User
    const user = await User.findOne({
      _id: userId,
      role: {
        $in: [ROLES.DEVELOPER, ROLES.CLIENT],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check Duplicate Email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already exists.",
        });
      }
    }

    // Update Fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      _id: userId,
      role: {
        $in: [ROLES.DEVELOPER, ROLES.CLIENT],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "User is already inactive.",
      });
    }

    user.isActive = false;

    await user.save();

    try {
      await mailSender(
        user.email,
        "FlowDesk Account Deactivated",
        accountDeactivatedTemplate(user.name),
      );
    } catch (error) {
      console.log("Failed to send deactivation email:", error.message);
    }

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
