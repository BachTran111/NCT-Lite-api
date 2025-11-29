import Genre from "../models/genre.model.js";

class GenreService {
  async getAllGenres() {
    return await Genre.find().lean();
  }

  async createGenre(name) {
    name = name.trim();
    if (!name) throw new Error("Genre name is required");

    // Tránh trùng
    const exists = await Genre.findOne({ name });
    if (exists) throw new Error("Genre already exists");

    const genre = new Genre({ name });
    return await genre.save();
  }

  async deleteGenre(id) {
    const deleted = await Genre.findByIdAndDelete(id);
    if (!deleted) throw new Error("Genre not found");
    return deleted;
  }
}

export default new GenreService();
