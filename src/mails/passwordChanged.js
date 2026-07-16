exports.passwordChanged = (name, email) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Changed</title>
</head>

<body style="margin:0;padding:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;background:#f3f6fb;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td style="background:#2563eb;padding:30px;text-align:center;">

<h1 style="margin:0;color:#ffffff;font-size:32px;">
FlowDesk
</h1>

<p style="margin-top:8px;color:#dbeafe;font-size:15px;">
Project Management System
</p>

</td>
</tr>

<!-- Success Icon -->
<tr>
<td align="center" style="padding-top:30px;">

<div style="
width:70px;
height:70px;
border-radius:50%;
background:#dcfce7;
line-height:70px;
font-size:36px;
">
✅
</div>

</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:20px 45px 10px;">

<h2 style="margin:0;color:#1f2937;">
Hello ${name},
</h2>

<p style="margin-top:18px;color:#4b5563;font-size:16px;line-height:1.8;">
Your FlowDesk account password has been changed successfully.
This email confirms that your account credentials were updated.
</p>

</td>
</tr>

<!-- Account Info -->
<tr>
<td style="padding:10px 45px;">

<table width="100%" cellpadding="0" cellspacing="0"
style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">

<tr>
<td style="padding:14px 18px;background:#f9fafb;width:170px;font-weight:bold;color:#374151;">
Account Email
</td>

<td style="padding:14px 18px;color:#111827;">
${email}
</td>
</tr>

<tr>
<td style="padding:14px 18px;background:#f9fafb;font-weight:bold;color:#374151;">
Changed On
</td>

<td style="padding:14px 18px;color:#111827;">
${new Date().toLocaleString()}
</td>
</tr>

</table>

</td>
</tr>

<!-- Notice -->
<tr>
<td style="padding:25px 45px 10px;">

<div style="
background:#eff6ff;
border-left:4px solid #2563eb;
padding:18px;
border-radius:6px;
color:#374151;
font-size:15px;
line-height:1.7;
">

<strong>Security Notice</strong><br><br>

If you made this change, you can safely ignore this email.

If you did <strong>not</strong> change your password, please reset it immediately and contact your administrator as soon as possible.

</div>

</td>
</tr>

<!-- Button -->
<tr>
<td align="center" style="padding:35px;">

<a href="http://localhost:5173/login"
style="
background:#2563eb;
color:#ffffff;
text-decoration:none;
padding:14px 34px;
border-radius:8px;
font-weight:bold;
display:inline-block;
font-size:15px;
">

Login to FlowDesk

</a>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="
background:#f9fafb;
padding:30px;
text-align:center;
font-size:13px;
color:#6b7280;
line-height:1.8;
">

Thank you for using <strong>FlowDesk</strong>.<br>

This is an automated email. Please do not reply.

<br><br>

© ${new Date().getFullYear()} FlowDesk. All Rights Reserved.

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
