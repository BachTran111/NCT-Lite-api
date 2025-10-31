import Song from "../models/song.model.js";
import mongoose from "mongoose";

class SongService {
  async getAll() {
    return await Song.find()
      .populate("genreIDs", "name")
      .populate("uploaderId", "username")
      .lean();
  }

  async searchSongs({ title, artist, genreIDs }) {
    const query = {};
    if (title) query.title = new RegExp(title, "i");
    if (artist) query.artist = new RegExp(artist, "i");

    if (genreIDs && genreIDs.length > 0) {
      query.genreIDs = {
        $in: genreIDs.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    return await Song.find(query)
      .populate("genreIDs", "name")
      .populate("uploaderId", "username")
      .lean();
  }

  async getById(id) {
    const song = await Song.findById(id)
      .populate("genreIDs", "name")
      .populate("uploaderId", "username")
      .lean();
    if (!song) throw new Error("Song not found");
    return song;
  }

  async createSong({
    title,
    artist,
    genreIDs = [],
    url,
    coverUrl,
    uploaderId,
  }) {
    if (!title || !url) throw new Error("Title and URL are required");

    const song = new Song({
      title,
      artist,
      genreIDs,
      url,
      coverUrl,
      uploaderId,
    });
    return await song.save();
  }

  async updateSong(id, updates) {
    const updated = await Song.findByIdAndUpdate(id, updates, { new: true })
      .populate("genreIDs", "name")
      .populate("uploaderId", "username")
      .lean();
    if (!updated) throw new Error("Song not found");
    return updated;
  }

  async deleteSong(id) {
    const deleted = await Song.findByIdAndDelete(id).lean();
    if (!deleted) throw new Error("Song not found");
    return deleted;
  }
}

export default new SongService();
