import { Router } from "express";
const router = Router();

import UserController from "../controllers/UserController";
import AuthController from "../controllers/AuthController";

router.post("/login", AuthController.login);
router.get("/user", AuthController.getDetails);

router.post("/user", UserController.createUser);
router.get("/users", UserController.getAllUsers);
router.get("/user/:id", UserController.getUser);
router.put("/user/:id", UserController.updateUser);
router.delete("/user/:id", UserController.deleteUser);

export default router;
