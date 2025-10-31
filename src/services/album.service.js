import { readData, writeData, getNextId } from "../utils/fileDb.js";
import Album from "../models/album.model.js";

class AlbumService {
  async getAll() {
    const data = await readData();
    return (data.albums || []).filter((a) => a.isPublic);
  }

  async getArtistAlbums() {
    const data = await readData();
    return (data.albums || []).filter(
      (a) => a.isPublic && a.artist && a.artist.trim() !== ""
    );
  }

  async getUserAlbums(userId) {
    const data = await readData();
    return (data.albums || []).filter((a) => a.creatorId === userId);
  }

  async getById(id, userId = null) {
    const data = await readData();
    const album = (data.albums || []).find((a) => a.id === Number(id));
    if (!album) throw new Error("Album not found");

    if (!album.isPublic && album.creatorId !== userId) {
      throw new Error("Access denied: private album");
    }

    return album;
  }

  // Tạo album (phân biệt nghệ sĩ / người dùng)
  async createAlbum({
    title,
    artist = "",
    songIDs = [],
    genreIDs = [],
    coverUrl,
    releaseDate,
    description,
    creatorId = null,
    isPublic = true,
  }) {
    const data = await readData();
    data.albums = data.albums || [];

    const id = await getNextId("albums");

    const album = new Album(
      id,
      title,
      artist,
      songIDs,
      genreIDs,
      coverUrl,
      releaseDate,
      description,
      creatorId,
      isPublic
    );

    data.albums.push(album);
    await writeData(data);
    return album;
  }

  async updateAlbum(id, updates, userId) {
    const data = await readData();
    data.albums = data.albums || [];

    const index = data.albums.findIndex((a) => a.id === Number(id));
    if (index === -1) throw new Error("Album not found");

    const album = data.albums[index];

    // Nếu là user album thì kiểm tra quyền
    if (album.creatorId && album.creatorId !== userId) {
      throw new Error("Unauthorized: cannot edit this album");
    }

    data.albums[index] = { ...album, ...updates };
    await writeData(data);
    return data.albums[index];
  }

  async deleteAlbum(id, userId) {
    const data = await readData();
    data.albums = data.albums || [];

    const index = data.albums.findIndex((a) => a.id === Number(id));
    if (index === -1) throw new Error("Album not found");

    const album = data.albums[index];
    if (album.creatorId && album.creatorId !== userId) {
      throw new Error("Unauthorized: cannot delete this album");
    }

    const deleted = data.albums.splice(index, 1)[0];
    await writeData(data);
    return deleted;
  }

  async getSongsInAlbum(id, userId = null) {
    const data = await readData();
    const album = (data.albums || []).find((a) => a.id === Number(id));
    if (!album) throw new Error("Album not found");

    if (!album.isPublic && album.creatorId !== userId) {
      throw new Error("Access denied: private album");
    }

    const allSongs = data.songs || [];
    const songs = allSongs.filter((song) => album.songIDs.includes(song.id));
    return { album, songs };
  }
}

export default new AlbumService();
