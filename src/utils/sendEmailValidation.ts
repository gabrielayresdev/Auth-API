import Auth from "../config/auth";
import path from "path";
import { transport } from "../config/mailer";
import handlebars from "handlebars";

export default async function sendEmailValidation(user: any) {
  const token = Auth.generateJWT(user);
  const url = `${process.env.CONFIRMATION_URL}/token=${token}`;

  try {
    //Construindo a mensagem
    const message = {
      from: process.env.MAIL_SENDER,
      to: user.email,
      subject: "Confirmação",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
        ${url}
      </body>
      </html>`,
    };

    //Enviando mensagem
    await transport.sendMail(message);
  } catch (error) {
    throw error;
  }
}
