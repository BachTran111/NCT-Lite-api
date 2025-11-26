import Song from "../models/song.model.js";
import Artist from "../models/artist.model.js";
import Album from "../models/album.model.js";
import UploadService from "../services/upload.service.js";
import mongoose from "mongoose";

class SongService {
  async getAll() {
    return await Song.find({ isApproved: true })
      .populate("genreIDs", "name")
      .populate("uploaderId", "username")
      .lean();
  }

  async getAllPending() {
    return await Song.find({ isApproved: false })
      .populate("genreIDs", "name")
      .populate("uploaderId", "username")
      .lean();
  }

  async approveSong(id) {
    const updated = await Song.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );
    if (!updated) throw new Error("Song not found");
    return updated;
  }

  async rejectSong(id) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const song = await Song.findById(id).session(session);
      if (!song) throw new Error("Song not found");

      if (song.songPublicId) {
        await UploadService.deleteFile(song.songPublicId, "video");
      }
      if (song.coverPublicId) {
        await UploadService.deleteFile(song.coverPublicId, "image");
      }

      await Song.findByIdAndDelete(id).session(session);

      await session.commitTransaction();
      session.endSession();

      return song.toObject();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  async searchSongs({ title, artist, genreIDs }) {
    const query = {
      isApproved: true,
      $or: [],
    };
    if (title) query.$or.push({ title: new RegExp(title, "i") });
    if (artist) query.$or.push({ artist: new RegExp(artist, "i") });

    if (genreIDs && genreIDs.length > 0) {
      query.$or.push({
        genreIDs: {
          $in: genreIDs.map((id) => new mongoose.Types.ObjectId(id)),
        },
      });
    }

    if (query.$or.length === 0) delete query.$or;

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

  // async createSong({
  //   title,
  //   artist,
  //   genreIDs = [],
  //   url,
  //   coverUrl,
  //   uploaderId,
  // }) {
  //   if (!title || !url) throw new Error("Title and URL are required");

  //   const song = new Song({
  //     title,
  //     artist,
  //     genreIDs,
  //     url,
  //     coverUrl,
  //     uploaderId,
  //   });
  //   return await song.save();
  // }

  async createSong({
    title,
    artist,
    genreIDs = [],
    url,
    coverUrl,
    uploaderId,
    songPublicId,
    coverPublicId,
  }) {
    if (!title || !url) throw new Error("Title and URL are required");

    // Ép kiểu ObjectId cho genreIDs
    if (genreIDs?.length) {
      genreIDs = genreIDs.map((id) =>
        mongoose.Types.ObjectId.isValid(id)
          ? id
          : new mongoose.Types.ObjectId(id)
      );
    }

    // Tự tạo artist nếu có tên nghệ sĩ
    if (artist && artist.trim()) {
      const exists = await Artist.findOne({ name: artist.trim() });
      if (!exists) await Artist.create({ name: artist.trim() });
    }

    const song = new Song({
      title,
      artist,
      genreIDs,
      url,
      coverUrl,
      uploaderId,
      songPublicId,
      coverPublicId,
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
    // 1. Lấy bài hát để có publicId
    const song = await Song.findById(id).lean();
    if (!song) throw new Error("Song not found");

    // 2. Xoá file trên Cloudinary
    try {
      if (song.songPublicId) {
        await UploadService.deleteFile(song.songPublicId, "video");
      }
      if (song.coverPublicId) {
        await UploadService.deleteFile(song.coverPublicId, "image");
      }
    } catch (err) {
      console.error("Failed to delete files on Cloudinary:", err.message);
    }

    // 3. Xoá document trong DB
    await Song.findByIdAndDelete(id);
    await Album.updateMany({ songIDs: songId }, { $pull: { songIDs: songId } });

    return song; // trả về bài vừa xoá
  }
}

export default new SongService();
