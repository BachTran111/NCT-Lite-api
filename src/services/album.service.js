import Album from "../models/album.model.js";

class AlbumService {
  async getAll() {
    return await Album.find({ isPublic: true }).populate("genreIDs", "name");
  }

  async getArtistAlbums() {
    return await Album.find({ isPublic: true, artist: { $ne: "" } }).populate(
      "genreIDs",
      "name"
    );
  }

  async getUserAlbums(userId) {
    return await Album.find({ creatorId: userId });
  }

  async getById(id, userId = null) {
    const album = await Album.findById(id)
      .populate("songIDs", "title artist coverUrl url")
      .populate("genreIDs", "name");
    if (!album) throw new Error("Album not found");

    if (!album.isPublic && album.creatorId?.toString() !== userId) {
      throw new Error("Access denied");
    }
    return album;
  }

  async createAlbum(data) {
    const album = new Album(data);
    return await album.save();
  }

  async updateAlbum(id, updates, userId) {
    const album = await Album.findById(id);
    if (!album) throw new Error("Album not found");
    if (album.creatorId && album.creatorId.toString() !== userId)
      throw new Error("Unauthorized");

    Object.assign(album, updates);
    return await album.save();
  }

  async deleteAlbum(id, userId) {
    const album = await Album.findById(id);
    if (!album) throw new Error("Album not found");
    if (album.creatorId && album.creatorId.toString() !== userId)
      throw new Error("Unauthorized");

    return await album.deleteOne();
  }
}

export default new AlbumService();
