import express from "express";
import AlbumController from "../controllers/album.controller.js";
import { authRequired } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", AlbumController.getAll);
router.get("/featured", AlbumController.getFeatured);
router.get("/me", authRequired, AlbumController.getUserAlbums);

router.get("/:id", AlbumController.getById);
router.get("/:id/songs", AlbumController.getSongsInAlbum);

router.post("/", authRequired, AlbumController.create);
router.put("/:id", authRequired, AlbumController.update);
router.delete("/:id", authRequired, AlbumController.delete);

export default router;
