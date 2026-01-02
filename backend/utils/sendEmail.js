import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendAlertEmail = async ({ to, subject, html }) => {
    if (process.env.EMAIL_DISABLED === "true") {
    console.log(`[EMAIL MOCK] To: ${to} | ${subject}`);
    return;
  }
  await transporter.sendMail({
    from: `"Media Monitor" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
};
