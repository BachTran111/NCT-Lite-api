import artistController from "../controllers/artist.controller.js";
import express from "express";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", artistController.getAll);
router.get("/:id", artistController.getById);
router.post("/", artistController.create);
router.put("/:id", artistController.update);
router.delete("/:id", artistController.delete);

export default router;
