import nodemailer from "nodemailer";

const mailSender = process.env.MAIL_SENDER;
const passwordSender = process.env.MAIL_PASSWORD;

export const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailSender,
    pass: passwordSender,
  },
});
