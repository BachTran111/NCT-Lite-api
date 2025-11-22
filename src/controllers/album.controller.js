import AlbumService from "../services/album.service.js";
import UploadService from "../services/upload.service.js";
import { OK } from "../handler/success-response.js";

class AlbumController {
  getAll = async (req, res, next) => {
    try {
      const albums = await AlbumService.getAll();
      res
        .status(200)
        .json(new OK({ message: "Fetched public albums", metadata: albums }));
    } catch (err) {
      next(err);
    }
  };

  getFeatured = async (req, res, next) => {
    try {
      const albums = await AlbumService.getArtistAlbums();
      res.status(200).json(
        new OK({
          message: "Fetched featured artist albums",
          metadata: albums,
        })
      );
    } catch (err) {
      next(err);
    }
  };

  getUserAlbums = async (req, res, next) => {
    try {
      const userId = req.user._id.toString();
      const albums = await AlbumService.getUserAlbums(userId);
      res
        .status(200)
        .json(new OK({ message: "Fetched your albums", metadata: albums }));
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const userId = req.user?._id?.toString() || null;
      const album = await AlbumService.getById(req.params.id, userId);
      res
        .status(200)
        .json(new OK({ message: "Fetched album", metadata: album }));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const userId = req.user._id.toString();

      let coverUrl = req.body.coverUrl;

      if (req.file) {
        const up = await UploadService.uploadCover(req.file.buffer);
        coverUrl = up.secure_url;
      }

      const album = await AlbumService.createAlbum({
        ...req.body,
        coverUrl,
        creatorId: userId,
      });

      res
        .status(201)
        .json(new OK({ message: "Album created", metadata: album }));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const userId = req.user._id.toString();

      let updates = { ...req.body };

      if (req.file) {
        const up = await UploadService.uploadCover(req.file.buffer);
        updates.coverUrl = up.secure_url;
      }

      const updated = await AlbumService.updateAlbum(
        req.params.id,
        updates,
        userId
      );

      res
        .status(200)
        .json(new OK({ message: "Album updated", metadata: updated }));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const userId = req.user._id.toString();
      const deleted = await AlbumService.deleteAlbum(req.params.id, userId);
      res
        .status(200)
        .json(new OK({ message: "Album deleted", metadata: deleted }));
    } catch (err) {
      next(err);
    }
  };

  getSongsInAlbum = async (req, res, next) => {
    try {
      const userId = req.user?._id?.toString() || null;
      const result = await AlbumService.getSongsInAlbum(req.params.id, userId);
      res.status(200).json(
        new OK({
          message: `Fetched songs in album '${result.album.title}'`,
          metadata: result,
        })
      );
    } catch (err) {
      next(err);
    }
  };

  addSong = async (req, res, next) => {
    try {
      const albumId = req.params.id;
      const { songId } = req.body;
      const userId = req.user._id.toString();

      const result = await AlbumService.addSongToAlbum(albumId, songId, userId);

      res.status(200).json(
        new OK({
          message: "Song added to album",
          metadata: result,
        })
      );
    } catch (err) {
      next(err);
    }
  };

  removeSong = async (req, res, next) => {
    try {
      const albumId = req.params.id;
      const songId = req.params.songId;
      const userId = req.user._id.toString();

      const result = await AlbumService.removeSongFromAlbum(
        albumId,
        songId,
        userId
      );

      res.status(200).json(
        new OK({
          message: "Song removed from album",
          metadata: result,
        })
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new AlbumController();
