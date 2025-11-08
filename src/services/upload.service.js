import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

class UploadService {
  async uploadToCloudinary(fileBuffer, folder, resourceType = "auto") {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType, // "video" cho mp3, "image" cho ảnh
          folder,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  async uploadSong(fileBuffer) {
    // mp3=video
    return await this.uploadToCloudinary(fileBuffer, "songs", "video");
  }

  async uploadCover(fileBuffer) {
    return await this.uploadToCloudinary(fileBuffer, "covers", "image");
  }

  async deleteFile(publicId, resourceType = "auto") {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  }
}

export default new UploadService();
