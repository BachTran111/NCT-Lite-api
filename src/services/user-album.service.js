import Album from "../models/album.model.js";
import UserAlbum from "../models/user-album.model.js";

class UserAlbumService {
  // Lấy album mặc định, chưa có thì tạo
  async getOrCreateFavoriteAlbum(userId) {
    // Check
    let link = await UserAlbum.findOne({
      userId,
      relationType: "FAVORITE",
    }).populate("albumId");

    if (link && link.albumId) {
      return link.albumId;
    }

    // Create
    const favoriteAlbum = await Album.create({
      title: "Bài hát yêu thích",
      artist: "Playlist của tôi",
      coverUrl: "",
      songIDs: [],
      isPublic: false,
      creatorId: userId,
    });

    //  Link fav
    await UserAlbum.create({
      userId,
      albumId: favoriteAlbum._id,
      relationType: "FAVORITE",
    });

    return favoriteAlbum;
  }

  async savePublicAlbum(userId, albumId) {
    const album = await Album.findById(albumId);
    if (!album || !album.isPublic) throw new Error("Album is not public");

    const link = await UserAlbum.findOneAndUpdate(
      { userId, albumId, relationType: "SAVED" },
      {},
      { new: true, upsert: true } //chưa có thì insert
    );

    return link;
  }

  async unsavePublicAlbum(userId, albumId) {
    await UserAlbum.findOneAndDelete({
      userId,
      albumId,
      relationType: "SAVED",
    });
  }

  async getMySavedAlbums(userId) {
    return await UserAlbum.find({
      userId,
      relationType: "SAVED",
    })
      .populate({
        path: "albumId",
        populate: [
          { path: "songIDs", select: "title artist coverUrl" },
          { path: "genreIDs", select: "name" },
        ],
      })
      .lean();
  }
}

export default new UserAlbumService();
