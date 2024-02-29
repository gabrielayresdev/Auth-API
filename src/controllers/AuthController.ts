import { Request, Response } from "express";
import Auth from "../config/auth";

import { PrismaClient } from "@prisma/client";
import filterUserData from "../utils/filterUserData";
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

   async logout(req, res) => {
    // Set token to none and expire after 5 seconds
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    })
    res
        .status(200)
        .json({ success: true, message: 'User logged out successfully' })
}

  async getDetails(req: Request, res: Response) {
    try {
      const token = Auth.getToken(req);
      const payload = Auth.decodeJWT(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(filterUserData(user));
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}

export default new AuthController();
