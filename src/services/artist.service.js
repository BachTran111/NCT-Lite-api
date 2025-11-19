import Artist from "../models/artist.model.js";

class ArtistService {
  async getAll() {
    return await Artist.find().lean();
  }

  async getById(id) {
    const artist = await Artist.findById(id).lean();
    if (!artist) throw new Error("Artist not found");
    return artist;
  }

  async createArtist({ name, description, avatarUrl }) {
    if (!name) throw new Error("Artist name is required");

    // Kiểm tra trùng tên
    const exists = await Artist.findOne({ name });
    if (exists) throw new Error("Artist already exists");

    const artist = new Artist({ name, description, avatarUrl });
    return await artist.save();
  }

  async updateArtist(id, updates) {
    const updated = await Artist.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();
    if (!updated) throw new Error("Artist not found");
    return updated;
  }

  async deleteArtist(id) {
    const deleted = await Artist.findByIdAndDelete(id).lean();
    if (!deleted) throw new Error("Artist not found");
    return deleted;
  }
}

export default new ArtistService();
