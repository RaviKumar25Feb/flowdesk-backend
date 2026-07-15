exports.accountCreatedTemplate = (name, email, password) => {
  return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Welcome to FlowDesk</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
        <tr>
            <td align="center">

                <table width="600" cellpadding="0" cellspacing="0"
                    style="background:#ffffff;border-radius:8px;padding:40px;">

                    <tr>
                        <td align="center">
                            <h1 style="margin:0;color:#2563eb;">
                                Welcome to FlowDesk 🚀
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding-top:30px;color:#333;font-size:16px;line-height:1.6;">

                            <p>Hi <strong>${name}</strong>,</p>

                            <p>
                                Your account has been successfully created by your Manager.
                                You can now login using the credentials below.
                            </p>

                            <table cellpadding="8" cellspacing="0"
                                style="margin:20px 0;background:#f8fafc;border:1px solid #e5e7eb;border-radius:6px;width:100%;">

                                <tr>
                                    <td><strong>Email</strong></td>
                                    <td>${email}</td>
                                </tr>

                                <tr>
                                    <td><strong>Temporary Password</strong></td>
                                    <td>${password}</td>
                                </tr>

                            </table>

                            <p>
                                For security reasons, we recommend changing your password
                                after your first login.
                            </p>

                            <p>
                                If you were not expecting this account, please contact your
                                Manager immediately.
                            </p>

                            <br>

                            <p>
                                Regards,<br>
                                <strong>FlowDesk Team</strong>
                            </p>

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
