import mongoose from "mongoose";

const historyItemSchema = new mongoose.Schema(
  {
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true },
    playedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
    },
    items: { type: [historyItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("PlayHistory", historySchema);
