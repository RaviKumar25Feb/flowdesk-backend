exports.accountCreated = (name) => {
  return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Welcome to FlowDesk</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
            <td align="center">

                <table width="600" cellpadding="0" cellspacing="0"
                    style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">

                    <tr>
                        <td align="center"
                            style="background:#2563eb;padding:30px;color:#ffffff;font-size:28px;font-weight:bold;">
                            Welcome to FlowDesk 🚀
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:35px;color:#333333;line-height:1.8;">

                            <h2 style="margin-top:0;">Hi ${name}, 👋</h2>

                            <p>
                                Congratulations! Your FlowDesk account has been created successfully.
                            </p>

                            <p>
                                You can now log in and start managing your projects, tasks, and team members with ease.
                            </p>

                            <table cellpadding="0" cellspacing="0" align="center" style="margin:30px auto;">
                                <tr>
                                    <td align="center"
                                        style="background:#2563eb;padding:14px 30px;border-radius:6px;">
                                        <a href="#"
                                            style="color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;">
                                            Login to FlowDesk
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p>
                                If you did not create this account, please contact our support team immediately.
                            </p>

                            <br>

                            <p>
                                Happy Building! 🚀
                            </p>

                            <p>
                                <strong>Team FlowDesk</strong>
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td align="center"
                            style="background:#f1f5f9;padding:20px;color:#666;font-size:13px;">
                            © ${new Date().getFullYear()} FlowDesk. All rights reserved.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
`;
};
