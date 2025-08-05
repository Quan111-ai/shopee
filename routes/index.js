// Đảm bảo import express-async-errors để tự động chuyển lỗi của các hàm async
require("express-async-errors");

var express = require("express");
var router = express.Router();

const { sendResponse, AppError } = require("d:/webb/backsau/helpers/utils");

// Route test: Nếu tham số "test" bằng "error" sẽ ném ra lỗi, không cần try/catch
router.get("/template/:test", async (req, res) => {
  const { test } = req.params;
  if (test === "error") {
    // Lỗi này sẽ được chuyển qua middleware xử lý lỗi của Express (bao gồm Sentry error handler)
    throw new AppError(401, "Access denied", "Authentication Error");
  } else {
    sendResponse(res, 200, true, { data: "template" }, null, "template success");
  }
});

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "Express" });
});

// Route test lỗi bất đồng bộ: Khi được gọi, lỗi sẽ tự động được chuyển qua middleware lỗi
router.get("/error-test", async (req, res) => {
  throw new Error("Test Sentry error capture");
});

// Các route phụ trợ khác
router.use("/users", require("./users"));
router.use("/products", require("./products"));
router.use("/login", require("./login"));
router.use("/register", require("./register"));
router.use("/category", require("./category"));
router.use("/profile", require("./profile"));
router.use("/sellerInfo", require("./sellerInfo"));

router.use("/deals", require("./deals"));



  

module.exports = router;