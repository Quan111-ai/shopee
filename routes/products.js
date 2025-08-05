const express = require("express");
const router = express.Router();

// 📦 Import controller
const createProduct = require("../controllers/Product/CreateProduct");
const getAllProducts = require("../controllers/Product/getAllProduct");
const getProductById = require("../controllers/Product/getProductByID");
const updateProduct = require("../controllers/Product/updateProduct");
const deleteProduct = require("../controllers/Product/deleteProduct");
const searchProduct = require("../controllers/Product/searchProduct");
const getPopularProducts = require("../controllers/Product/getPopularProducts");
const rateProduct = require("../controllers/Product/rateProduct");
const getRatings = require("../controllers/Product/getRatings");
const updateRating = require("../controllers/Product/updateRating");
const deleteRating = require("../controllers/Product/deleteRating");

const getProductsByShopLevel = require("../controllers/SellerManager/getProductsByShopLevel");

const { authenticate } = require("../controllers/middleware/authenticate");

// 📦 Import schema validator và middleware validate
const validationMiddleware = require("../controllers/middleware/validation.middleware");
const createProductSchema = require("../controllers/src/productSchemaValidator/createProductSchema");
const updateProductSchema = require("../controllers/src/productSchemaValidator/updateProductSchema");
const getProductByIdSchema = require("../controllers/src/productSchemaValidator/getProductByIdSchema");
const searchProductSchema = require("../controllers/src/productSchemaValidator/searchProductSchema");

// 📦 Import Multer middleware
const upload = require("../controllers/middleware/multer.middleware");

/*
 * @route   POST /products
 * @desc    Tạo sản phẩm mới (không có ảnh)
 */
router.post("/", validationMiddleware(createProductSchema), createProduct);

/*
 * @route   PATCH /products/:id/upload-images
 * @desc    Cập nhật nhiều ảnh sản phẩm
 */
router.patch("/:id/upload-images", authenticate, upload, updateProduct);

/*
 * @route   PUT /products/:id
 * @desc    Cập nhật thông tin sản phẩm (không bao gồm ảnh)
 */
router.put("/:id", authenticate, validationMiddleware(updateProductSchema), updateProduct);

/*
 * @route   DELETE /products/:id
 * @desc    Xóa sản phẩm
 */
router.delete("/:id", validationMiddleware(getProductByIdSchema, "params"), deleteProduct);

/*
 * @route   GET /products
 * @desc    Lấy toàn bộ sản phẩm
 */
router.get("/", getAllProducts);

/*
 * @route   GET /products/search
 * @desc    Tìm sản phẩm theo từ khoá
 */
router.get("/search", validationMiddleware(searchProductSchema, "query"), searchProduct);

/*
 * @route   GET /products/popular
 * @desc    Lấy các sản phẩm phổ biến
 */
router.get("/popular", getPopularProducts);

/*
 * @route   GET /products/:id
 * @desc    Lấy chi tiết sản phẩm theo ID
 */
router.get("/:id", validationMiddleware(getProductByIdSchema, "params"), getProductById);

/*
 * @route   POST /products/:productId/rate
 * @desc    Người dùng đánh giá sản phẩm
 */
router.post("/:productId/rate", authenticate, rateProduct);

/*
 * @route   GET /products/:productId/ratings
 * @desc    Lấy tất cả đánh giá của sản phẩm
 */
router.get("/:productId/ratings", getRatings);

/*
 * @route   PATCH /products/:productId/ratings/:ratingId
 * @desc    Sửa đánh giá sản phẩm
 */
router.patch("/:productId/ratings/:ratingId", authenticate, updateRating);

/*
 * @route   DELETE /products/:productId/ratings/:ratingId
 * @desc    Xoá đánh giá sản phẩm
 */
router.delete("/:productId/ratings/:ratingId", authenticate, deleteRating);

/*
 * @route   GET /products-by-shop-level?level=Shop Mall
 * @desc    Lấy sản phẩm thuộc cấp độ shop
 */
router.get("/products-by-shop-level", getProductsByShopLevel);

module.exports = router;