import mongoose from "mongoose";

const userAlbumSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: true,
    },

    // FAVORITE: album yêu thích mặc định
    // SAVED: album public mà user lưu ve lib
    relationType: {
      type: String,
      enum: ["FAVORITE", "SAVED"],
      default: "SAVED",
    },
  },
  { timestamps: true }
);

// Mỗi user chỉ nên có 1 liên kết FAVORITE với 1 album,không trùng cặp user-album cùng loại
userAlbumSchema.index(
  { userId: 1, albumId: 1, relationType: 1 },
  { unique: true }
);

export default mongoose.model("UserAlbum", userAlbumSchema);
