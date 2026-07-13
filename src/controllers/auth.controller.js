const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const OTP = require("../models/otp.model");
const { generateOTP } = require("../utils/generateOTP");
const { mailSender } = require("../utils/mailSender");
const { passwordChanged } = require("../mails/passwordChanged");
const { resetPasswordToken } = require("../mails/resetPasswordToken");
const { accountCreated } = require("../mails/accountCreated");

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Remove old OTPs
    await OTP.deleteMany({ email });

    // Generate OTP
    const otp = await generateOTP();

    // Save OTP
    await OTP.create({
      email,
      otp,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.signup = async (req, res) => {
  try {
    // Get Data
    const { name, email, password, role, otp } = req.body;

    // Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
      });
    }

    // Verify OTP
    const recentOTP = await OTP.find({ email });

    if (recentOTP.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (recentOTP[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Create User
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Create Profile
    const profile = await Profile.create({
      user: user._id,
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        name,
      )}`,
    });

    // Link Profile
    user.profile = profile._id;
    await user.save();

    // Send Welcome Mail
    try {
      await mailSender(
        user.email,
        "Welcome to FlowDesk",
        accountCreated(user.name),
      );
    } catch (error) {
      console.log("Failed to send welcome email:", error.message);
    }

    // Delete Used OTP
    await OTP.deleteMany({ email });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    // Fetch User Without Password
    const responseUser = await User.findById(user._id).populate("profile");

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check User
    const user = await User.findOne({ email }).populate("profile");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Compare Password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    // Remove Password
    user.password = undefined;

    // Set Cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    //get user data from req.body
    const userDetails = await User.findById(req.user.id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //get old pass, new pass, confirm pass
    const { oldPassword, newPassword, confirmPassword } = req.body;

    //validate old password is match or not
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password,
    );
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "old password is incorrect",
      });
    }

    //validate new password is different as old password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      userDetails.password,
    );
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as old password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //update password
    const updatedDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: hashedPassword },
      { new: true },
    );

    //notify the user that password been changed
    try {
      await mailSender(
        updatedDetails.email,
        "Password Changed Successfully",
        passwordChanged(updatedDetails.name),
      );
    } catch (error) {
      console.log(error.message);
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createToken = async (req, res) => {
  try {
    const { email } = req.body;

    //varifiy that email
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    //create random token
    const newToken = await generateOTP();

    //save into the user document
    await User.findByIdAndUpdate(
      userExist._id,
      {
        resetPasswordToken: newToken,
        resetPasswordExpires: Date.now() + 10 * 60 * 1000,
      },
      { new: true },
    );

    //send to user email
    await mailSender(
      email,
      "Reset Your Password",
      resetPasswordToken(userExist.name, newToken),
    );

    return res.status(200).json({
      success: true,
      message: "Reset token sent successfully",
    });
  } catch (error) {
    console.log("Error while creating reset token");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    //get an email from req.body
    const { email, newPassword, confirmPassword, resetPasswordToken } =
      req.body;

    //varifiy that email
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "user does not exist",
      });
    }

    //check user resetPasswordToken expire to nhi hua
    if (Date.now() > userExist.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: "Reset password token has expired",
      });
    }

    //verify the token
    if (userExist.resetPasswordToken !== resetPasswordToken) {
      return res.status(400).json({
        success: false,
        message: "Token does not match",
      });
    }

    //check user old pass or new pass same or not
    const isSamePassword = await bcrypt.compare(
      newPassword,
      userExist.password,
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    //delete corrunt token after varification
    userExist.resetPasswordToken = "";
    userExist.resetPasswordExpires = null;

    //save into the user document
    userExist.password = newPassword;
    await userExist.save();

    try {
      await mailSender(
        userExist.email,
        "Password Reset Successfully",
        passwordChanged(userExist.name),
      );
    } catch (error) {
      console.log("Failed to send password reset notification:", error.message);
    }

    return res.status(200).json({
      success: true,
      message: "new password created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
