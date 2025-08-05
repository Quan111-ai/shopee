// controllers/deal/index.js
const createDeal = require("./createDeal");
const { getDealById, getDealsList } = require("./getDeal");
const updateDeal = require("./updateDeal");
const deleteDeal = require("./deleteDeal");
const applyDeal = require("./applyDeal");
const assignDealToUser = require("./assignDeal");

module.exports = {
  createDeal,
  getDealById,
  getDealsList,
  updateDeal,
  deleteDeal,
  applyDeal,
  assignDealToUser,
};