exports.resetPasswordToken = (name, token) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Your Password</title>
</head>

<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="620" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">

<!-- Header -->
<tr>
<td align="center"
style="background:#2563eb;padding:32px 24px;color:#ffffff;">

<h1 style="margin:0;font-size:28px;">
Devolyt
</h1>

<p style="margin:10px 0 0;font-size:15px;opacity:.95;">
Devolyt Technologies Pvt. Ltd.
</p>

</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:35px 40px;color:#374151;font-size:15px;line-height:1.8;">

<p style="margin-top:0;">
Hello <strong>${name}</strong>,
</p>

<p>
We received a request to reset the password for your
<strong>Devolyt</strong> account.
</p>

<p>
Please use the verification code below to continue with your password reset.
</p>

<!-- Verification Code -->
<div
style="
margin:30px 0;
padding:20px;
background:#eff6ff;
border:1px solid #bfdbfe;
border-radius:10px;
text-align:center;
">

<p
style="
margin:0;
font-size:13px;
color:#6b7280;
letter-spacing:1px;
text-transform:uppercase;
">
Verification Code
</p>

<p
style="
margin:12px 0 0;
font-size:36px;
font-weight:bold;
letter-spacing:8px;
color:#2563eb;
">
${token}
</p>

</div>

<p>
This verification code will expire in
<strong>10 minutes</strong>.
</p>

<div
style="
margin-top:25px;
background:#fef3c7;
border-left:4px solid #f59e0b;
padding:18px;
border-radius:8px;
color:#92400e;
line-height:1.8;
">

<strong>Security Notice</strong>

<p style="margin:12px 0 0;">
If you did not request a password reset,
you can safely ignore this email.
Your account will remain secure.
</p>

</div>

<br>

<p style="margin-bottom:0;">
Regards,
</p>

<p style="margin-top:4px;font-weight:bold;color:#111827;">
Devolyt Technologies Pvt. Ltd.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td align="center"
style="background:#f9fafb;padding:22px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:13px;line-height:1.8;">

© ${new Date().getFullYear()} Devolyt Technologies Pvt. Ltd.
<br>
Devolyt • Internal Project Management System
<br><br>
This is an automated email. Please do not reply.

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
