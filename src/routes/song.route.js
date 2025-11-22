import express from "express";
import multer from "multer";
import SongController from "../controllers/song.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", SongController.getAll);
router.get("/search", SongController.search);
router.get("/:id", SongController.getById);

router.post(
  "/",
  authRequired,
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  SongController.create
);

router.put("/:id", authRequired, SongController.update);
router.delete("/:id", authRequired, SongController.delete);

export default router;
