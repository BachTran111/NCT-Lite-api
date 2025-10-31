import SongService from "../services/song.service.js";
import { OK } from "../handler/success-response.js";

class SongController {
  getAll = async (req, res, next) => {
    try {
      const songs = await SongService.getAll();
      res
        .status(200)
        .json(new OK({ message: "Fetched all songs", metadata: songs }));
    } catch (err) {
      next(err);
    }
  };

  search = async (req, res, next) => {
    try {
      let { title, artist, genreIDs } = req.query;
      if (typeof genreIDs === "string") {
        genreIDs = genreIDs.split(",");
      }

      const songs = await SongService.searchSongs({ title, artist, genreIDs });
      res
        .status(200)
        .json(new OK({ message: "Search results", metadata: songs }));
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const song = await SongService.getById(req.params.id);
      res.status(200).json(new OK({ message: "Fetched song", metadata: song }));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { title, artist, genreIDs, url, coverUrl } = req.body;
      if (!title || !url) throw new Error("Title and URL are required");

      const uploaderId = req.user?.id || null;
      const song = await SongService.createSong({
        title,
        artist,
        genreIDs,
        url,
        coverUrl,
        uploaderId,
      });

      res.status(201).json(new OK({ message: "Song created", metadata: song }));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const updated = await SongService.updateSong(req.params.id, req.body);
      res
        .status(200)
        .json(new OK({ message: "Song updated", metadata: updated }));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const deleted = await SongService.deleteSong(req.params.id);
      res
        .status(200)
        .json(new OK({ message: "Song deleted", metadata: deleted }));
    } catch (err) {
      next(err);
    }
  };
}

export default new SongController();
