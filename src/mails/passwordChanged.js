exports.passwordChanged = (name, email) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Changed Successfully</title>
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
style="background:#16a34a;padding:32px 24px;color:#ffffff;">

<h1 style="margin:0;font-size:28px;">
Devolyt
</h1>

<p style="margin:10px 0 0;font-size:15px;opacity:.95;">
Devolyt Technologies Pvt. Ltd.
</p>

</td>
</tr>

<!-- Success Icon -->
<tr>
<td align="center" style="padding-top:35px;">

<div style="
width:72px;
height:72px;
border-radius:50%;
background:#dcfce7;
line-height:72px;
font-size:34px;
display:inline-block;
">
✅
</div>

</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:30px 40px 10px;color:#374151;font-size:15px;line-height:1.8;">

<p style="margin-top:0;">
Hello <strong>${name}</strong>,
</p>

<p>
Your Devolyt account password has been changed successfully.
This email confirms that your account credentials were updated.
</p>

<p>
If this password change was made by you, no further action is required.
</p>

</td>
</tr>

<!-- Account Information -->
<tr>
<td style="padding:10px 40px;">

<table width="100%" cellpadding="10" cellspacing="0"
style="border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">

<tr>
<td width="180">
<strong>Account Email</strong>
</td>

<td>
${email}
</td>
</tr>

<tr>
<td>
<strong>Password Changed On</strong>
</td>

<td>
${new Date().toLocaleString()}
</td>
</tr>

</table>

</td>
</tr>

<!-- Security Notice -->
<tr>
<td style="padding:25px 40px 10px;">

<div
style="
background:#eff6ff;
border-left:4px solid #2563eb;
padding:18px;
border-radius:8px;
color:#374151;
line-height:1.8;
">

<strong>Security Notice</strong>

<p style="margin:12px 0 0;">
If you did <strong>not</strong> perform this action,
please reset your password immediately and contact your
manager or the IT team as soon as possible.
</p>

</div>

</td>
</tr>

<!-- Button -->
<tr>
<td align="center" style="padding:35px;">

<a
href="http://localhost:5173/login"
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

Login to Devolyt

</a>

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
