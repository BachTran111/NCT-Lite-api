import express from "express";
import GenreController from "../controllers/genre.controller.js";
import { authRequired, adminRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", GenreController.getAll);

router.post("/", authRequired, adminRequired, GenreController.create);
router.delete("/:id", authRequired, adminRequired, GenreController.delete);

export default router;
