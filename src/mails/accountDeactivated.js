exports.accountDeactivatedTemplate = (name) => {
  return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Account Deactivated</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:8px;overflow:hidden;">

<tr>
<td style="background:#2563eb;padding:20px;text-align:center;">
<h1 style="color:#ffffff;margin:0;">FlowDesk</h1>
</td>
</tr>

<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;color:#333;">
Hello ${name},
</h2>

<p style="color:#555;font-size:16px;line-height:1.7;">
Your <strong>FlowDesk</strong> account has been <strong>deactivated</strong> by your organization administrator.
</p>

<p style="color:#555;font-size:16px;line-height:1.7;">
You will no longer be able to sign in to your FlowDesk account while it remains deactivated.
</p>

<p style="color:#555;font-size:16px;line-height:1.7;">
Your account information and work history have been securely retained by your organization.
</p>

<p style="color:#d32f2f;font-size:16px;line-height:1.7;">
If you believe this action was taken in error, please contact your manager or administrator for assistance.
</p>

<hr style="margin:30px 0;border:none;border-top:1px solid #ddd;">

<p style="color:#777;font-size:14px;">
Thank you for using FlowDesk.
</p>

<p style="color:#777;font-size:14px;">
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
