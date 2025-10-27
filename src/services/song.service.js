import { readData, writeData, getNextId } from "../utils/fileDb.js";
import Song from "../models/song.model.js";

class SongService {
  async getAll() {
    const data = await readData();
    return data.songs || [];
  }

  async searchSongs({ title, artist, genreIDs }) {
    const data = await readData();
    let songs = data.songs || [];

    if (title)
      songs = songs.filter((s) =>
        s.title.toLowerCase().includes(title.toLowerCase())
      );
    if (artist)
      songs = songs.filter((s) =>
        s.artist.toLowerCase().includes(artist.toLowerCase())
      );
    if (genreIDs && genreIDs.length > 0)
      songs = songs.filter((s) =>
        s.genreIDs?.some((id) => genreIDs.includes(id))
      );

    return songs;
  }

  async getById(id) {
    const data = await readData();
    const song = (data.songs || []).find((s) => s.id === Number(id));
    if (!song) throw new Error("Song not found");
    return song;
  }

  async createSong({
    title,
    artist,
    genreIDs = [],
    url,
    coverUrl,
    uploaderId,
  }) {
    const data = await readData();
    data.songs = data.songs || [];

    const id = await getNextId("songs");
    const song = new Song(
      id,
      title,
      artist,
      genreIDs,
      url,
      coverUrl,
      uploaderId
    );

    data.songs.push(song);
    await writeData(data);
    return song;
  }

  async updateSong(id, updates) {
    const data = await readData();
    data.songs = data.songs || [];

    const index = data.songs.findIndex((s) => s.id === Number(id));
    if (index === -1) throw new Error("Song not found");

    if (updates.genreIDs && !Array.isArray(updates.genreIDs)) {
      updates.genreIDs = [updates.genreIDs];
    }

    data.songs[index] = { ...data.songs[index], ...updates };
    await writeData(data);

    return data.songs[index];
  }

  async deleteSong(id) {
    const data = await readData();
    data.songs = data.songs || [];

    const index = data.songs.findIndex((s) => s.id === Number(id));
    if (index === -1) throw new Error("Song not found");

    const deleted = data.songs.splice(index, 1)[0];
    await writeData(data);

    return deleted;
  }
}

export default new SongService();
