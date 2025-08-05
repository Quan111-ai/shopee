// routes/paymentCrud.js
const express = require("express");
const router = express.Router();

// Import các controller CRUD riêng từng file
const createPayment = require("../controllers/pay/createPayment");
const getPayment = require("../controllers/pay/getPayment");
const updatePayment = require("../controllers/pay/updatePayment");
const deletePayment = require("../controllers/pay/deletePayment");

// Định nghĩa endpoint cho CRUD Payment
router.post("/", createPayment);           // Create
router.get("/:id", getPayment);              // Read
router.put("/:id", updatePayment);           // Update
router.delete("/:id", deletePayment);        // Delete

module.exports = router;