exports.passwordChanged = (name) => {
  return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Password Changed</title>

    <style>

        body{
            background:#f5f5f5;
            font-family:Arial,sans-serif;
            margin:0;
            padding:0;
        }

        .container{
            width:100%;
            max-width:600px;
            margin:40px auto;
            background:white;
            border-radius:8px;
            overflow:hidden;
            box-shadow:0 2px 10px rgba(0,0,0,.08);
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
            line-height:1.7;
        }

        .footer{
            background:#f3f4f6;
            text-align:center;
            padding:15px;
            font-size:13px;
            color:#666;
        }

    </style>

</head>

<body>

<div class="container">

    <div class="header">
        Password Updated
    </div>

    <div class="content">

        <h2>Hello ${name},</h2>

        <p>
            Your account password has been changed successfully.
        </p>

        <p>
            If you made this change, no further action is required.
        </p>

        <p>
            If you did <strong>not</strong> change your password, please reset it immediately and contact our support team.
        </p>

        <p>
            Thank you,<br>
            <strong>FlowDesk Team</strong>
        </p>

    </div>

    <div class="footer">
        © ${new Date().getFullYear()} FlowDesk. All Rights Reserved.
    </div>

</div>

</body>

</html>
`;
};
