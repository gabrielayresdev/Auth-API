import { Request, Response } from "express";
import Auth from "../config/auth";

import { PrismaClient } from "@prisma/client";
import filterUserData from "../utils/filterUserData";
import sendEmailValidation from "../utils/sendEmailAuthentication";
const prisma = new PrismaClient();

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: req.body.email },
      });
      if (!user)
        return res.status(404).json({ message: "Usuário não encontrado." });
      const { password } = req.body;
      if (Auth.checkPassword(password, user.hash, user.salt)) {
        if (!user.emailConfirmed) {
          return res
            .status(401)
            .send("Email não confirmado. Por favor, confirme seu email.");
        }

        const token = Auth.generateJWT(user);

        res.cookie("token1", token, {
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          maxAge: 3600000,
        });

        return res.status(200).send();
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async logout(req: Request, res: Response) {
    // Set token to none and expire after 5 seconds
    res.cookie("token1", "none", {
      sameSite: "strict",
      secure: true,
      expires: new Date(new Date(0)),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  }

  async getDetails(req: Request, res: Response) {
    try {
      const token = Auth.getToken(req);
      const payload = Auth.decodeJWT(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) return res.status(404).json({ message: "User not found" });
      if (!user.emailConfirmed) {
        return res
          .status(401)
          .send("Email não confirmado. Por favor, confirme seu email.");
      }

      return res.status(200).json(filterUserData(user));
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async confirmEmail(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const payload = Auth.decodeJWT(token);
      const user = await prisma.user.update({
        where: { id: payload.sub },
        data: {
          emailConfirmed: true,
        },
      });
      console.log(user);
      return res.status(200).send("Email confirmado");
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) return res.status(404).json({ message: "User not found" });

      const token = Auth.generateJWT(user, "1h");

      sendEmailValidation(user, token, "reset");

      await prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          passwordResetToken: token,
        },
      });

      return res.status(200).send("Email enviado");
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;
      const payload = Auth.decodeJWT(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) return res.status(404).json({ message: "User not found" });

      const valid = user.passwordResetToken === token;
      if (!valid)
        return res.status(401).json({ message: "Invalid Token or expired" });

      const { hash, salt } = Auth.generatePassword(password);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          hash,
          salt,
        },
      });

      return res.status(200).send("Email confirmado");
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}

export default new AuthController();
