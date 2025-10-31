import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    genreIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
    url: { type: String, required: true },
    coverUrl: { type: String },
    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Song", songSchema);
