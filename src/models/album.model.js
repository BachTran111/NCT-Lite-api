import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, default: "" }, // nghệ sĩ hoặc để trống nếu user tạo
    songIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    genreIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
    coverUrl: { type: String },
    releaseDate: { type: Date },
    description: { type: String },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Album", albumSchema);
