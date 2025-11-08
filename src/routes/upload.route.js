import express from "express";
import multer from "multer";
import { authRequired } from "../middlewares/auth.middleware.js";
import UploadController from "../controllers/upload.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/song", authRequired, upload.single("file"), UploadController.uploadSong);
router.post("/cover", authRequired, upload.single("file"), UploadController.uploadCover);
router.delete("/", authRequired, UploadController.deleteFile);

export default router;
