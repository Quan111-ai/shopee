const express = require("express");
const router = express.Router();

const createBanner = require("../controllers/banner/createBanner");
const getAllBanner = require("../controllers/banner/getAllBanner");
const updateBanner = require("../controllers/banner/updateBanner");
const deleteBanner = require("../controllers/banner/deleteBanner");
const displayBanner = require("../controllers/banner/displayBanner"); 
router.get("/", getAllBanner);
router.post("/", createBanner);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);

router.patch("/display/:bannerId", displayBanner);

module.exports = router;