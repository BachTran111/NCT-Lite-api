import GenreService from "../services/genre.service.js";
import { OK } from "../handler/success-response.js";

class GenreController {
  getAll = async (req, res, next) => {
    try {
      const genres = await GenreService.getAllGenres();
      res.status(200).json(
        new OK({
          message: "Fetched all genres",
          metadata: genres,
        })
      );
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const { name } = req.body;

      const genre = await GenreService.createGenre(name);
      res.status(201).json(
        new OK({
          message: "Genre created",
          metadata: genre,
        })
      );
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const deleted = await GenreService.deleteGenre(req.params.id);

      res.status(200).json(
        new OK({
          message: "Genre deleted",
          metadata: deleted,
        })
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new GenreController();
