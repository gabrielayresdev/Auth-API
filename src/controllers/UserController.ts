import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { Request, Response } from "express";
import Auth from "../config/auth";
import filtrarDadosDoCliente from "../utils/filterUserData";
import sendEmailValidation from "../utils/sendEmailValidation";

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { password, birthDate, ...userData } = req.body;
      const { hash, salt } = Auth.generatePassword(password);
      const data = {
        ...userData,
        birthDate: new Date(birthDate).toISOString(),
        hash,
        salt,
        emailConfirmed: false,
      };

      const user = await prisma.user.create({
        data: data,
      });
      sendEmailValidation(user);

      res.status(201).json(filtrarDadosDoCliente(user));
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const user = await prisma.user.findMany();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: id },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const token = Auth.getToken(req);
      const payload = Auth.decodeJWT(token);

      // Remove dados que não devem ser usados
      const { password, email, updateData } = req.body;

      const cliente = await prisma.user.update({
        where: { id: payload.sub },
        data: updateData,
      });

      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const token = Auth.getToken(req);
      const payload = Auth.decodeJWT(token);

      // Remove dados que não devem ser usados
      const { password, newPassword } = req.body;
      const user = await prisma.user.findUnique({
        where: { id: payload },
      });
      if (!user)
        return res.status(404).json({ message: "Usuário não encontrado." });

      if (Auth.checkPassword(password, user.hash, user.salt)) {
        const { hash, salt } = Auth.generatePassword(newPassword);
        await prisma.user.update({
          where: { id: payload.sub },
          data: { hash, salt },
        });

        res.status(200).send("Senha redefinida com sucesso!");
      } else return res.status(404).json({ message: "Senha inválida" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.delete({
        where: { id: id },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default new UserController();
