import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./routes/auth.route.js";
import songRouter from "./routes/song.route.js";
import albumRouter from "./routes/album.route.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/songs", songRouter);
app.use("/api/albums", albumRouter);

app.get("/", (req, res) => res.send("API running....!"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

export default app;
