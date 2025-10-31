import Song from "../models/song.model.js";

class SongService {
  async getAll() {
    return await Song.find().populate("genreIDs", "name").lean();
  }

  async getById(id) {
    const song = await Song.findById(id).populate("genreIDs", "name");
    if (!song) throw new Error("Song not found");
    return song;
  }

  async createSong(data) {
    const song = new Song(data);
    return await song.save();
  }

  async updateSong(id, updates) {
    const updated = await Song.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) throw new Error("Song not found");
    return updated;
  }

  async deleteSong(id) {
    const deleted = await Song.findByIdAndDelete(id);
    if (!deleted) throw new Error("Song not found");
    return deleted;
  }
}

export default new SongService();
