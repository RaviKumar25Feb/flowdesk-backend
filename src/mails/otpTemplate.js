exports.otpTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>FlowDesk OTP Verification</title>
    </head>

    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

      <div style="
        max-width: 500px;
        margin: auto;
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
      ">

        <h2 style="color: #2563eb;">
          FlowDesk
        </h2>

        <p>
          Hello,
        </p>

        <p>
          Use the following OTP to verify your email address.
        </p>

        <h1 style="
          letter-spacing: 8px;
          color: #111827;
          margin: 20px 0;
        ">
          ${otp}
        </h1>

        <p>
          This OTP is valid for <b>5 minutes</b>.
        </p>

        <p style="color: #6b7280; font-size: 14px;">
          If you didn't request this OTP, please ignore this email.
        </p>

        <hr />

        <p style="font-size: 12px; color: #9ca3af;">
          © FlowDesk. All rights reserved.
        </p>

      </div>

    </body>
    </html>
  `;
};
