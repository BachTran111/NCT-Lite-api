import HistoryService from "../services/history.service.js";
import { OK } from "../handler/success-response.js";

class HistoryController {
  getMine = async (req, res, next) => {
    try {
      const items = await HistoryService.get(req.user._id);
      res
        .status(200)
        .json(new OK({ message: "History fetched", metadata: items }));
    } catch (e) {
      next(e);
    }
  };

  add = async (req, res, next) => {
    try {
      const { songID } = req.body;
      if (!songID) throw new Error("songID is required");
      const items = await HistoryService.addPlay(req.user._id, songID);
      res
        .status(201)
        .json(new OK({ message: "History updated", metadata: items }));
    } catch (e) {
      next(e);
    }
  };

  remove = async (req, res, next) => {
    try {
      const items = await HistoryService.remove(
        req.user._id,
        req.params.songId
      );
      res
        .status(200)
        .json(new OK({ message: "Removed from history", metadata: items }));
    } catch (e) {
      next(e);
    }
  };

  clear = async (req, res, next) => {
    try {
      const items = await HistoryService.clear(req.user._id);
      res
        .status(200)
        .json(new OK({ message: "History cleared", metadata: items }));
    } catch (e) {
      next(e);
    }
  };
}

export default new HistoryController();
