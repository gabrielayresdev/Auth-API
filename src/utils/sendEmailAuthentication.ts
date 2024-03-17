import Auth from "../config/auth";
import { transport } from "../config/mailer";

export default async function sendEmailAuthentication(
  user: any,
  token: string,
  path: string = ""
) {
  const url = `${process.env.CONFIRMATION_URL}/${path}/token=${token}`;

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
