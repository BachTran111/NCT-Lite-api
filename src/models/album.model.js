class Album {
  constructor(
    id,
    title,
    artist = "",
    songIDs = [],
    genreIDs = [],
    coverUrl,
    releaseDate,
    description,
    creatorId = null,
    isPublic = true
  ) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.songIDs = songIDs;
    this.genreIDs = genreIDs;
    this.coverUrl = coverUrl; // ảnh bìa album
    this.releaseDate = releaseDate;
    this.description = description;
    this.creatorId = creatorId; // id người tạo (nếu là user)
    this.isPublic = isPublic;
    this.createdAt = new Date().toISOString();
  }
}

export default Album;
