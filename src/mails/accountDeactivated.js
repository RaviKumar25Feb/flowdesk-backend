exports.accountDeactivatedTemplate = (name) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Account Deactivated</title>
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
              style="background:#dc2626;padding:32px 24px;color:#ffffff;">
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
            <td style="padding:35px;color:#374151;font-size:15px;line-height:1.8;">

              <p style="margin-top:0;">
                Hello <strong>${name}</strong>,
              </p>

              <p>
                This is to inform you that your
                <strong>Devolyt</strong> account has been
                <strong>deactivated</strong> by your organization.
              </p>

              <div
                style="
                  margin:25px 0;
                  padding:18px;
                  background:#fef2f2;
                  border:1px solid #fecaca;
                  border-radius:8px;
                ">

                <strong style="color:#b91c1c;">
                  Account Status: Deactivated
                </strong>

                <p style="margin:12px 0 0;color:#7f1d1d;">
                  You will no longer be able to access Devolyt until your account is reactivated.
                </p>

              </div>

              <p>
                Your account information, assigned projects, and work history
                have been securely retained by
                <strong>Devolyt Technologies Pvt. Ltd.</strong>
              </p>

              <p>
                If you believe your account was deactivated by mistake,
                please contact your manager or the IT team for assistance.
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
