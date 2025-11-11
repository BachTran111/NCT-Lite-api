import mongoose from "mongoose";
import PlayHistory from "../models/history.model.js";

class HistoryService {
  // populate bài hát
  async get(userId) {
    const doc = await PlayHistory.findOne({ userId })
      .populate({
        path: "items.song",
        select: "title artist coverUrl url genreIDs",
        populate: { path: "genreIDs", select: "name" },
      })
      .lean();
    return doc?.items ?? [];
  }

  // Ghi nhận 1 lần phát
  async addPlay(userId, songId) {
    await PlayHistory.updateOne(
      { userId },
      { $pull: { items: { song: new mongoose.Types.ObjectId(songId) } } },
      { upsert: true }
    );

    const updated = await PlayHistory.findOneAndUpdate(
      { userId },
      {
        $push: {
          items: {
            $each: [{ song: songId, playedAt: new Date() }],
            $position: 0, // thêm ở đầu
            $slice: 20, // giữ lại 20
          },
        },
      },
      { upsert: true, new: true }
    ).populate({
      path: "items.song",
      select: "title artist coverUrl url genreIDs",
      populate: { path: "genreIDs", select: "name" },
    });

    return updated.items;
  }

  async remove(userId, songId) {
    const updated = await PlayHistory.findOneAndUpdate(
      { userId },
      { $pull: { items: { song: songId } } },
      { new: true }
    ).populate({ path: "items.song", select: "title artist coverUrl url" });

    return updated?.items ?? [];
  }

  async clear(userId) {
    const updated = await PlayHistory.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true, upsert: true }
    );
    return updated.items;
  }
}

export default new HistoryService();
