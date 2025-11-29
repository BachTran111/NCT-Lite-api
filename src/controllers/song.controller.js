import SongService from "../services/song.service.js";
import UploadService from "../services/upload.service.js";
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

  getAllPending = async (req, res, next) => {
    try {
      const songs = await SongService.getAllPending();
      res.status(200).json(
        new OK({
          message: "Fetched pending songs",
          metadata: songs,
        })
      );
    } catch (err) {
      next(err);
    }
  };

  getMySongs = async (req, res, next) => {
    try {
      const userId = req.user._id.toString();
      const songs = await SongService.getMySongs(userId);

      res.status(200).json(
        new OK({
          message: "Fetched your uploaded songs",
          metadata: songs,
        })
      );
    } catch (err) {
      next(err);
    }
  };

  approveSong = async (req, res, next) => {
    try {
      const song = await SongService.approveSong(req.params.id);
      res.status(200).json(
        new OK({
          message: "Song approved",
          metadata: song,
        })
      );
    } catch (err) {
      next(err);
    }
  };

  rejectSong = async (req, res, next) => {
    try {
      const song = await SongService.rejectSong(req.params.id);
      res.status(200).json(
        new OK({
          message: "Song rejected and deleted",
          metadata: song,
        })
      );
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
      let { title, artist, genreIDs, url, coverUrl } = req.body;
      if (!title) throw new Error("Title is required");

      // Chuẩn hoá genreIDs từ form-data (string) -> array
      // chấp nhận: ["id1","id2"] hoặc "id1,id2"
      if (typeof genreIDs === "string") {
        try {
          const maybeJson = JSON.parse(genreIDs);
          genreIDs = Array.isArray(maybeJson) ? maybeJson : genreIDs.split(",");
        } catch {
          genreIDs = genreIDs.split(",");
        }
      }

      let songPublicId, coverPublicId;

      if (req.files?.song?.[0]) {
        const up = await UploadService.uploadSong(req.files.song[0].buffer);
        url = up.secure_url;
        songPublicId = up.public_id;
      }
      if (req.files?.cover?.[0]) {
        const up2 = await UploadService.uploadCover(req.files.cover[0].buffer);
        coverUrl = up2.secure_url;
        coverPublicId = up2.public_id;
      }

      if (!url)
        throw new Error("URL is required (provide file 'song' or a 'url')");

      const uploaderId = req.user?._id || req.user?.id || null;

      const song = await SongService.createSong({
        title,
        artist,
        genreIDs,
        url,
        coverUrl,
        uploaderId,
        songPublicId,
        coverPublicId,
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
