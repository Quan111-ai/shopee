// File: controllers/category/index.js
const createCategory = require("./createCategory");
const { getCategories, getCategoryById } = require("./getCategories");
const updateCategory = require("./updateCategory");
const deleteCategory = require("./deleteCategory");

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};