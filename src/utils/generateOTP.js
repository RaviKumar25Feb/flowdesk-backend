const otpGenerator = require("otp-generator");
const OTP = require("../models/otp.model");

exports.generateOTP = async () => {
  let otp;
  let existingOTP = true;

  while (existingOTP) {
    otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    existingOTP = await OTP.findOne({ otp });
  }

  return otp;
};
