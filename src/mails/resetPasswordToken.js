exports.resetPasswordToken = (name, token) => {
  return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Reset Password</title>

    <style>

        body{
            background:#f4f4f4;
            font-family:Arial,sans-serif;
            margin:0;
            padding:0;
        }

        .container{
            width:100%;
            max-width:600px;
            margin:40px auto;
            background:#ffffff;
            border-radius:8px;
            overflow:hidden;
            box-shadow:0 2px 10px rgba(0,0,0,.1);
        }

        .header{
            background:#2563eb;
            color:white;
            text-align:center;
            padding:20px;
            font-size:24px;
            font-weight:bold;
        }

        .content{
            padding:30px;
            color:#333;
        }

        .token{
            text-align:center;
            font-size:34px;
            font-weight:bold;
            letter-spacing:8px;
            color:#2563eb;
            margin:25px 0;
        }

        .footer{
            text-align:center;
            padding:20px;
            background:#f8f8f8;
            color:#777;
            font-size:13px;
        }

    </style>

</head>

<body>

<div class="container">

<div class="header">
Reset Password
</div>

<div class="content">

<h2>Hello ${name},</h2>

<p>
We received a request to reset your password.
</p>

<p>
Use the verification code below to reset your password.
</p>

<div class="token">
${token}
</div>

<p>
This code is valid for <strong>10 minutes</strong>.
</p>

<p>
If you didn't request a password reset, you can safely ignore this email.
</p>

<p>
Thanks,<br>
<b>FlowDesk Team</b>
</p>

</div>

<div class="footer">
© ${new Date().getFullYear()} FlowDesk. All rights reserved.
</div>

</div>

</body>
</html>
`;
};
