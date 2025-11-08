import UploadService from "../services/upload.service.js";
import { OK } from "../handler/success-response.js";

class UploadController {
  uploadSong = async (req, res, next) => {
    try {
      if (!req.file) throw new Error("No file uploaded");

      const result = await UploadService.uploadSong(req.file.buffer);
      res.status(200).json(
        new OK({
          message: "Song uploaded",
          metadata: {
            url: result.secure_url,
            public_id: result.public_id,
            duration: result.duration,
          },
        })
      );
    } catch (err) {
      next(err);
    }
  };

  uploadCover = async (req, res, next) => {
    try {
      if (!req.file) throw new Error("No file uploaded");

      const result = await UploadService.uploadCover(req.file.buffer);
      res.status(200).json(
        new OK({
          message: "Cover uploaded",
          metadata: {
            url: result.secure_url,
            public_id: result.public_id,
          },
        })
      );
    } catch (err) {
      next(err);
    }
  };

  deleteFile = async (req, res, next) => {
    try {
      const { public_id, type } = req.body;
      if (!public_id) throw new Error("public_id is required");

      const result = await UploadService.deleteFile(public_id, type || "auto");
      res.status(200).json(
        new OK({
          message: "File deleted",
          metadata: result,
        })
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new UploadController();
