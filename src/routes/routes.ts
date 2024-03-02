import { Router } from "express";
const router = Router();

import UserController from "../controllers/UserController";
import AuthController from "../controllers/AuthController";
import { userValidator } from "../controllers/validator";

router.post("/login", AuthController.login);
router.get("/profile", AuthController.getDetails);
router.post("/logout", AuthController.logout);

router.post("/user", userValidator, UserController.createUser);
router.get("/users", UserController.getAllUsers);
router.get("/user/:id", UserController.getUser);
router.put("/user/:id", UserController.updateUser);
router.delete("/user/:id", UserController.deleteUser);

export default router;
