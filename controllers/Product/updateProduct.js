const Product = require("../../models/Product");
const cloudinary = require("d:/webb/backsau/helpers/cloundinary");
const streamifier = require("streamifier");
const { AppError } = require("../../helpers/utils");

// ✅ Hàm upload ảnh lên Cloudinary
const uploadImageToCloudinary = (buffer, folderPath) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderPath },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const updateProduct = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError(401, "User not authenticated"));
    }

    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (req.user.role !== "seller" || String(product.sellerID) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this product" });
    }

    let updateData = {};

    // ✅ Danh sách trường có thể cập nhật
    const allowedFields = ["name", "description", "price", "categoryID", "quality", "imageURL", "gallery"];

    // ✅ Chỉ nhận các trường hợp lệ
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    // ✅ Kiểm tra nếu `gallery` chưa tồn tại hoặc không phải mảng
    if (!Array.isArray(product.gallery)) {
      product.gallery = [];
    }

    // ✅ Nếu có file upload, thêm nhiều ảnh vào sản phẩm
    if (req.files?.images?.length > 0) {
      const productFolder = `products/${product.sellerID}/${productId}`;
      const newImageURLs = await Promise.all(
        req.files.images.map(file => uploadImageToCloudinary(file.buffer, productFolder))
      );

      updateData.gallery = [...product.gallery, ...newImageURLs];
    }

    // ✅ Nếu có ảnh đại diện mới, cập nhật `imageURL`
    if (req.body.imageURL) {
      updateData.imageURL = req.body.imageURL;
    }

    // ✅ Cập nhật sản phẩm trong MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({ success: true, product: updatedProduct, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    next(error);
  }
};

module.exports = updateProduct;