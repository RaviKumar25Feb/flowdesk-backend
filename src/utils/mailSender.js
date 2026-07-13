const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.mailSender = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"FlowDesk" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error("Mail Error:", error.message);
    throw error;
  }
};
