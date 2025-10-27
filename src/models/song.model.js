class Song {
  constructor(id, title, artist, genreIDs = [], url, coverUrl, uploaderId) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.genreIDs = genreIDs;
    this.url = url;
    this.coverUrl = coverUrl; // Ảnh bìa
    this.uploaderId = uploaderId;
    this.createdAt = new Date().toISOString();
  }
}

export default Song;
