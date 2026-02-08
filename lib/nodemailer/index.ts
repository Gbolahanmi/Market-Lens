import nodemailer from "nodemailer";
import { text } from "stream/consumers";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";
import { email } from "better-auth";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendWelcomeEmail = async ({ email, name, intro }) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{introText}}",
    intro,
  );
  const mailOptions = {
    from: `"MarketLens" <marketlens${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: "Welcome to MarketLens - Your Investment Companion!",
    text: `Thanks for joining MarketLens, We are excited to have you on board.`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
