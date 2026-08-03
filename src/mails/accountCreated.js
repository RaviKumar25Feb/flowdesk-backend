exports.accountCreatedTemplate = (name, email, password) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Welcome to Devolyt Technologies Pvt. Ltd.</title>
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
                Welcome to Devolyt
              </h1>

              <p style="margin:10px 0 0;font-size:15px;opacity:.95;">
                Devolyt Technologies Pvt. Ltd.
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:35px;color:#374151;font-size:15px;line-height:1.8;">

              <p style="margin-top:0;">
                Hi <strong>${name}</strong>,
              </p>

              <p>
                Welcome to <strong>Devolyt Technologies Pvt. Ltd.</strong>
              </p>

              <p>
                Your Devolyt account has been successfully created by your manager.
                You can now sign in using the credentials below.
              </p>

              <table width="100%" cellpadding="10" cellspacing="0"
                style="margin:25px 0;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">

                <tr>
                  <td width="180">
                    <strong>Email</strong>
                  </td>

                  <td>
                    ${email}
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Temporary Password</strong>
                  </td>

                  <td>
                    <span style="
                      display:inline-block;
                      background:#eff6ff;
                      color:#1d4ed8;
                      padding:8px 12px;
                      border-radius:6px;
                      font-weight:bold;
                      letter-spacing:1px;
                    ">
                      ${password}
                    </span>
                  </td>
                </tr>

              </table>

              <p>
                <strong>Important:</strong>
                For security reasons, please change your password immediately after your first login.
              </p>

              <p>
                If you did not expect this account or believe this email was sent in error,
                please contact your manager or the IT team immediately.
              </p>

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
              style="background:#f9fafb;padding:20px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:13px;">

              © ${new Date().getFullYear()} Devolyt Technologies Pvt. Ltd.
              <br>
              Devolyt • Internal Project Management System

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
