import nodemailer from "nodemailer";
import dotenv from "dotenv";
import config from "../config";

dotenv.config();

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: config.nodemailer_email_user,
      pass: config.nodemailer_email_pass,
    },
  });

  await transporter.sendMail({
    from: `"Joy-Mart" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password within 10 minutes",
    text: "Click the link to reset your password.",
    html,
  });
};
