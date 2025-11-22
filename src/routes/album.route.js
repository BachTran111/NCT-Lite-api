import express from "express";
import multer from "multer";
import AlbumController from "../controllers/album.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/:id/add-song", authRequired, AlbumController.addSong);
router.delete("/:id/remove-song/:songId", authRequired, AlbumController.removeSong);

router.get("/", AlbumController.getAll);
router.get("/featured", AlbumController.getFeatured);
router.get("/me", authRequired, AlbumController.getUserAlbums);

router.get("/:id", AlbumController.getById);
router.get("/:id/songs", AlbumController.getSongsInAlbum);

router.post("/", authRequired, upload.single("cover"), AlbumController.create);

router.put(
  "/:id",
  authRequired,
  upload.single("cover"),
  AlbumController.update
);

router.delete("/:id", authRequired, AlbumController.delete);

export default router;
