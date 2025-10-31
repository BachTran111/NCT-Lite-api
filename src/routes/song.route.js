import express from "express";
import SongController from "../controllers/song.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", SongController.getAll);
router.get("/search", SongController.search);
router.get("/:id", SongController.getById);

router.post("/", authRequired, SongController.create);
router.put("/:id", authRequired, SongController.update);
router.delete("/:id", authRequired, SongController.delete);

export default router;
