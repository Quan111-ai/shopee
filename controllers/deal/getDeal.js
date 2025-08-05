// controllers/deal/getDeal.js
const Deal = require("../../models/Deal");
const { AppError, sendResponse } = require("../../helpers/utils");

const getDealById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("getDealById: Fetching deal with id:", id);

    const deal = await Deal.findById(id);
    if (!deal) {
      console.error("getDealById: Deal not found with id:", id);
      return next(new AppError(404, "Deal not found"));
    }

    console.log("getDealById: Deal found:", deal);
    return sendResponse(
      res,
      200,
      true,
      deal,
      null,
      "Deal retrieved successfully."
    );
  } catch (error) {
    console.error("getDealById error:", error);
    next(error);
  }
};

const getDealsList = async (req, res, next) => {
  try {
    console.log("getDealsList: Fetching all deals");

    const deals = await Deal.find({});
    console.log("getDealsList: Deals found:", deals);

    return sendResponse(
      res,
      200,
      true,
      deals,
      null,
      "Deals list retrieved successfully."
    );
  } catch (error) {
    console.error("getDealsList error:", error);
    next(error);
  }
};

module.exports = { getDealById, getDealsList };