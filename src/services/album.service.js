import Album from "../models/album.model.js";
import mongoose from "mongoose";

class AlbumService {
  async getAll() {
    return await Album.find({ isPublic: true })
      .populate("genreIDs", "name")
      .populate("creatorId", "username")
      .lean();
  }

  async getArtistAlbums() {
    return await Album.find({ isPublic: true, artist: { $ne: "" } })
      .populate("genreIDs", "name")
      .populate("creatorId", "username")
      .lean();
  }

  async getUserAlbums(userId) {
    return await Album.find({ creatorId: userId })
      .populate("genreIDs", "name")
      .populate("songIDs", "title artist coverUrl")
      .lean();
  }

  async getById(id, userId = null) {
    const album = await Album.findById(id)
      .populate({
        path: "songIDs",
        populate: [
          { path: "genreIDs", select: "name" },
          { path: "uploaderId", select: "username" },
        ],
      })
      .populate("genreIDs", "name")
      .populate("creatorId", "username")
      .lean();

    if (!album) throw new Error("Album not found");
    if (!album.isPublic && album.creatorId?._id.toString() !== userId)
      throw new Error("Access denied");

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
      throw new Error("Unauthorized: cannot edit this album");

    Object.assign(album, updates);
    await album.save();

    return await album.populate("genreIDs", "name");
  }

  async deleteAlbum(id, userId) {
    const album = await Album.findById(id);
    if (!album) throw new Error("Album not found");
    if (album.creatorId && album.creatorId.toString() !== userId)
      throw new Error("Unauthorized: cannot delete this album");

    await album.deleteOne();
    return album;
  }

  async getSongsInAlbum(id, userId = null) {
    const album = await Album.findById(id)
      .populate({
        path: "songIDs",
        populate: [
          { path: "genreIDs", select: "name" },
          { path: "uploaderId", select: "username" },
        ],
      })
      .populate("genreIDs", "name")
      .populate("creatorId", "username")
      .lean();

    if (!album) throw new Error("Album not found");
    if (!album.isPublic && album.creatorId?._id.toString() !== userId)
      throw new Error("Access denied");

    return { album, songs: album.songIDs };
  }
}

export default new AlbumService();
