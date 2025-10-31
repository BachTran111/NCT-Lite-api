import AlbumService from "../services/album.service.js";
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
      res
        .status(200)
        .json(
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
      const artistName = req.body.artist?.trim() || "";
      const creatorId = artistName !== "" ? null : userId;

      const album = await AlbumService.createAlbum({ ...req.body, creatorId });
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
      const updated = await AlbumService.updateAlbum(
        req.params.id,
        req.body,
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
}

export default new AlbumController();
