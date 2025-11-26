const nodemailer = require("nodemailer");

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
} = process.env;

let transporter;

if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
} else {
  console.warn(
    "[emailService] SMTP credentials missing. Emails will be logged to console."
  );
}

const buildEmailTemplate = ({
  title = "Wealth Planning",
  greeting,
  message,
  buttonLabel,
  buttonUrl,
  secondaryText,
  footerText,
}) => {
  return `
  <body style="margin:0;padding:0;background:#f4f7f4;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:30px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(30,64,41,0.08);">
            <tr>
              <td style="background:#1e4029;padding:24px 32px;">
                <h1 style="margin:0;font-size:20px;font-weight:500;color:#ffffff;letter-spacing:0.08em;text-transform:uppercase;">
                  ${title}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px;font-size:16px;color:#1e4029;">
                  ${greeting || "Bonjour,"}
                </p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4a5c52;">
                  ${message || ""}
                </p>
                ${
                  buttonLabel && buttonUrl
                    ? `<a href="${buttonUrl}" style="display:inline-block;padding:14px 28px;background:#2d5f3f;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:600;letter-spacing:0.04em;margin-bottom:16px;">
                        ${buttonLabel}
                      </a>`
                    : ""
                }
                ${
                  secondaryText
                    ? `<p style="margin:12px 0 0;font-size:13px;color:#7b8c82;">
                        ${secondaryText}
                      </p>`
                    : ""
                }
                ${
                  buttonUrl
                    ? `<p style="margin:18px 0 0;font-size:12px;color:#9aa79f;">
                        Si le bouton ne fonctionne pas, copiez/collez ce lien dans votre navigateur :
                        <br />
                        <a href="${buttonUrl}" style="color:#2d5f3f;">${buttonUrl}</a>
                      </p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="background:#f1f5f2;padding:20px 32px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#7b8c82;">
                  ${footerText || "© " + new Date().getFullYear() + " Wealth Planning. Tous droits réservés."}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  `;
};

const sendEmail = async ({ to, subject, html }) => {
  if (!to || !subject || !html) {
    throw new Error("Missing email parameters");
  }

  if (!transporter) {
    console.info("[emailService] Email content", { to, subject, html });
    return;
  }

  await transporter.sendMail({
    from: EMAIL_FROM || SMTP_USER,
    to,
    subject,
    html,
  });
};

module.exports = { sendEmail, buildEmailTemplate };

