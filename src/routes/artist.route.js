import artistController from "../controllers/artist.controller.js";
import express from "express";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/artists", artistController.getAll);
router.get("/artists/:id", artistController.getById);
router.post("/artists", artistController.create);
router.put("/artists/:id", artistController.update);
router.delete("/artists/:id", artistController.delete);

export default router;
