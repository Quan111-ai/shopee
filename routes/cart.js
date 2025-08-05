const express = require("express");
const router = express.Router();

// ✅ Controller
const getCart = require("../controllers/cart/getCart");
const addToCart = require("../controllers/cart/addToCart");
const updateCartItem = require("../controllers/cart/updateCartItem");
const removeCartItem = require("../controllers/cart/removeCartItem");
const clearCart = require("../controllers/cart/clearCart");
const selectCartItem = require("../controllers/cart/selectCartItem");
const selectCartItemSchema = require("../controllers/src/cartSchemaValidator/selectCartItemSchema");

const { confirmCheckout, checkout } = require("../controllers/cart/confirmCheckout"); // ✅ Gộp confirm + checkout

// ✅ Middleware
const { authenticate } = require("../controllers/middleware/authenticate");
const validationMiddleware = require("../controllers/middleware/validation.middleware");

// ✅ Schema validator
const addToCartSchema = require("../controllers/src/cartSchemaValidator/addToCartSchema");
const updateCartItemSchema = require("../controllers/src/cartSchemaValidator/updateCartItemSchema");
const removeCartItemSchema = require("../controllers/src/cartSchemaValidator/removeCartItemSchema");
const checkoutCartSchema = require("../controllers/src/cartSchemaValidator/checkoutCartSchema");

// ✅ Áp xác thực cho toàn bộ route giỏ
router.use(authenticate);

// 🛒 Lấy giỏ hàng
router.get("/", getCart);

// ➕ Thêm sản phẩm vào giỏ
router.post("/add", validationMiddleware(addToCartSchema), addToCart);

// 🔄 Cập nhật số lượng
router.put("/update", validationMiddleware(updateCartItemSchema), updateCartItem);

// ❌ Xoá sản phẩm theo ID
router.delete(
  "/remove/:productId",
  validationMiddleware(removeCartItemSchema, "params"),
  removeCartItem
);

// 🧹 Xoá toàn bộ giỏ hàng
router.delete("/clear", clearCart);

// ✅ Xác nhận đơn trước thanh toán
router.get("/confirm", confirmCheckout);

// ✅ Thanh toán giỏ hàng
router.post("/checkout", validationMiddleware(checkoutCartSchema), checkout);


router.patch(
  "/select/:itemId",
  validationMiddleware(selectCartItemSchema, "paramsAndBody"),
  selectCartItem
);



module.exports = router;