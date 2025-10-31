import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get("/me", authRequired, AuthController.me);

export default router;
