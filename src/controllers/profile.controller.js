const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const { uploadToCloudinary } = require("../utils/uploadToCloudinary");
const { cloudinary } = require("../config/cloudinary.config");

//get user profile details
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "profile",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove password before sending response
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//update user profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      bio,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      country,
      pincode,
      github,
      linkedin,
      portfolio,
      designation,
      department,
      skills,
    } = req.body;

    // Get logged in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update name (User Model)
    if (name !== undefined) {
      user.name = name;
    }

    await user.save();

    // Get profile
    const profile = await Profile.findById(user.profile);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Update profile fields
    if (phone !== undefined) profile.phone = phone;
    if (bio !== undefined) profile.bio = bio;
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (gender !== undefined) profile.gender = gender;
    if (address !== undefined) profile.address = address;
    if (city !== undefined) profile.city = city;
    if (state !== undefined) profile.state = state;
    if (country !== undefined) profile.country = country;
    if (pincode !== undefined) profile.pincode = pincode;
    if (github !== undefined) profile.github = github;
    if (linkedin !== undefined) profile.linkedin = linkedin;
    if (portfolio !== undefined) profile.portfolio = portfolio;
    if (designation !== undefined) profile.designation = designation;
    if (department !== undefined) profile.department = department;
    if (skills !== undefined) profile.skills = skills;

    await profile.save();

    const updatedUser = await User.findById(req.user.id).populate("profile");

    updatedUser.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//update avatar
exports.updateAvatar = async (req, res) => {
  try {
    // Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an avatar image",
      });
    }

    // Find User
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await Profile.findById(user.profile);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    //agar old image hai to delete kardo phle
    if (profile.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(profile.avatarPublicId);
      } catch (err) {
        console.log("Failed to delete old avatar:", err.message);
      }
    }

    // Upload new image to Cloudinary
    const uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      "FlowDesk/Avatars",
    );

    // Save both publicImg id, and avatar url
    profile.avatar = uploadedImage.secure_url;
    profile.avatarPublicId = uploadedImage.public_id;

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      avatar: profile.avatar,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
