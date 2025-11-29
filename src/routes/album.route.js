import express from "express";
import multer from "multer";
import AlbumController from "../controllers/album.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", AlbumController.getAll);
router.get("/featured", AlbumController.getFeatured);
router.get("/me", authRequired, AlbumController.getUserAlbums);
router.get("/me/saved", authRequired, AlbumController.getMySavedAlbums);

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

router.post("/:id/save", authRequired, AlbumController.saveAlbum);
router.delete("/:id/save", authRequired, AlbumController.unsaveAlbum);

router.post("/:id/add-song", authRequired, AlbumController.addSong);
router.delete("/:id/remove-song/:songId", authRequired, AlbumController.removeSong);

export default router;
