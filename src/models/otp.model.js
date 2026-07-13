const mongoose = require("mongoose");
const { mailSender } = require("../utils/mailSender");
const { otpTemplate } = require("../mails/otpTemplate");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
  },
  {
    timestamps: true,
  },
);

// Send OTP Email Automatically
otpSchema.pre("save", async function () {
  await mailSender(
    this.email,
    "FlowDesk Email Verification",
    otpTemplate(this.otp),
  );
});

module.exports = mongoose.model("OTP", otpSchema);
