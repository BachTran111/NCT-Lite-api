import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import "./models/user.model.js";
import "./models/genre.model.js";
import "./models/song.model.js";
import "./models/album.model.js";

import authRouter from "./routes/auth.route.js";
import songRouter from "./routes/song.route.js";
import albumRouter from "./routes/album.route.js";
import historyRouter from "./routes/history.route.js";

import { errorHandler } from "./middlewares/error-handler.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/songs", songRouter);
app.use("/api/albums", albumRouter);
app.use("/api/history", historyRouter);

app.get("/", (req, res) => res.send("🎵 Music API running..."));

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
