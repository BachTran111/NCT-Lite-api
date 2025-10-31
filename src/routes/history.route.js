import express from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import HistoryController from "../controllers/history.controller.js";

const router = express.Router();
router.use(authRequired);

router.get("/", HistoryController.getMine);
router.post("/", HistoryController.add); // Ghi 1 lần phát
router.delete("/item/:songId", HistoryController.remove);
router.delete("/clear", HistoryController.clear);

export default router;
