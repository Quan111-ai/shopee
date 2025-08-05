const { sendResponse, AppError } = require("../../helpers/utils");
const CategoryGroup = require("../../models/CategoryGroup");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer xử lý ảnh upload
const upload = multer();

const uploadThumbnail = [
  upload.single("thumbnail"),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!req.file) throw new AppError(400, "No image uploaded");

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "category-group-thumbnail",
          resource_type: "image",
        },
        async (error, result) => {
          if (error) return next(new AppError(500, "Upload failed"));

          const updated = await CategoryGroup.findByIdAndUpdate(
            id,
            { thumbnail: result.secure_url },
            { new: true }
          );
          sendResponse(res, 200, true, updated, null, "Thumbnail updated");
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } catch (error) {
      next(error);
    }
  },
];

module.exports = uploadThumbnail;