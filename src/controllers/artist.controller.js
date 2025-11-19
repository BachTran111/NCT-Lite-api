import ArtistService from "../services/artist.service.js";
import { OK } from "../handler/success-response.js";

class ArtistController {
  getAll = async (req, res, next) => {
    try {
      const artists = await ArtistService.getAll();
      res
        .status(200)
        .json(new OK({ message: "Fetched all artists", metadata: artists }));
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const artist = await ArtistService.getById(req.params.id);
      res
        .status(200)
        .json(new OK({ message: "Fetched artist", metadata: artist }));
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { name, description, avatarUrl } = req.body;

      const artist = await ArtistService.createArtist({
        name,
        description,
        avatarUrl,
      });

      res
        .status(201)
        .json(new OK({ message: "Artist created", metadata: artist }));
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const updated = await ArtistService.updateArtist(req.params.id, req.body);
      res
        .status(200)
        .json(new OK({ message: "Artist updated", metadata: updated }));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const deleted = await ArtistService.deleteArtist(req.params.id);
      res
        .status(200)
        .json(new OK({ message: "Artist deleted", metadata: deleted }));
    } catch (err) {
      next(err);
    }
  };
}

export default new ArtistController();
