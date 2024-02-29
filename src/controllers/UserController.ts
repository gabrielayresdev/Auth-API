import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { Request, Response } from "express";
import auth from "../config/auth";
import filtrarDadosDoCliente from "../utils/filterUserData";

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const {
        name,
        lastName,
        email,
        password,
        cpf,
        phone,
        birthDate,
        cep,
        state,
        city,
        neighborhood,
        street,
        houseNumber,
        addressRef = null,
      } = req.body;
      const { hash, salt } = auth.generatePassword(password);
      const data = {
        name,
        lastName,
        email,
        cpf,
        phone,
        birthDate: new Date(birthDate).toISOString(),
        cep,
        state,
        city,
        neighborhood,
        street,
        houseNumber,
        addressRef,
        hash,
        salt,
      };

      const user = await prisma.user.create({
        data: data,
      });

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
      const { id } = req.params;
      const cliente = await prisma.user.update({
        where: { id: id },
        data: req.body,
      });
      res.status(200).json(cliente);
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
