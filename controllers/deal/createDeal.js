const Deal = require("../../models/Deal");
const Product = require("../../models/Product");
const { AppError, sendResponse } = require("../../helpers/utils");

const createDeal = async (req, res, next) => {
  try {
    if (!req.user || !["seller", "admin", "staff"].includes(req.user.role)) {
      throw new AppError(403, "You are not authorized to create a deal.");
    }

    let productIDs = [];

    if (req.body.category) {
      const products = await Product.find({ categoryID: req.body.category });
      if (!products || products.length === 0) {
        throw new AppError(404, `No products found for category: ${req.body.category}`);
      }
      productIDs = products.map((p) => p._id);
    } else {
      productIDs = req.body.productIDs;
      if (!productIDs && req.body.productID) {
        productIDs = [req.body.productID];
      }
    }

    if (!productIDs || !Array.isArray(productIDs) || productIDs.length === 0) {
      throw new AppError(400, "At least one productID must be provided, or a valid category must be provided.");
    }

    const {
      title,
      discountPercentage,
      fixedAmount,
      quantity,
      eligibleRanks,
      dealType = "percentage",
    } = req.body;

    let { startDate, endDate, durationInHours } = req.body;
    let finalStartDate = null;
    let finalEndDate = null;
    let status = "pending";

    const allowedTypes = ["cheapest", "flash", "fixedAmount", "percentage"];
    if (!allowedTypes.includes(dealType)) {
      throw new AppError(400, `Invalid dealType. Must be one of: ${allowedTypes.join(", ")}`);
    }

    if (dealType === "cheapest") {
      const cheapestProduct = await Product.find({
        _id: { $in: productIDs },
      }).sort({ price: 1 }).limit(1);

      if (!cheapestProduct || cheapestProduct.length === 0) {
        throw new AppError(404, "No valid product found for 'cheapest' deal.");
      }

      productIDs = [cheapestProduct[0]._id];
    }

    if (dealType === "fixedAmount") {
      if (!fixedAmount || isNaN(fixedAmount) || fixedAmount <= 0) {
        throw new AppError(400, "fixedAmount must be a positive number for dealType 'fixedAmount'.");
      }
    }

    if (dealType === "flash" && !durationInHours) {
      durationInHours = 2;
    }

    if (startDate && endDate) {
      finalStartDate = new Date(startDate);
      finalEndDate = new Date(endDate);

      if (finalStartDate >= finalEndDate) {
        throw new AppError(400, "Start date must be before end date.");
      }

      const now = new Date();
      if (now >= finalStartDate && now <= finalEndDate) {
        status = "active";
      } else {
        status = "pending";
      }
    } else if (durationInHours) {
      durationInHours = Number(durationInHours);
      if (isNaN(durationInHours) || durationInHours <= 0) {
        throw new AppError(400, "durationInHours must be a positive number.");
      }
      status = "pending";
    } else {
      throw new AppError(400, "Either (startDate and endDate) or durationInHours must be provided.");
    }

    if (req.user.role === "seller") {
      for (let productId of productIDs) {
        const product = await Product.findById(productId);
        if (!product) {
          throw new AppError(404, `Product not found for id: ${productId}`);
        }

        if (!product.sellerID.equals(req.user._id)) {
          throw new AppError(
            403,
            `You cannot create a deal for product ${productId} because it does not belong to your shop.`
          );
        }
      }
    }

    const deal = new Deal({
      title,
      dealType,
      productIDs,
      discountPercentage: dealType === "percentage" ? discountPercentage : undefined,
      fixedAmount: dealType === "fixedAmount" ? fixedAmount : undefined,
      quantity,
      eligibleRanks: eligibleRanks?.length > 0 ? eligibleRanks : ["Đồng", "Bạc", "Vàng", "Kim Cương"],
      startDate: finalStartDate,
      endDate: finalEndDate,
      durationInHours,
      status,
      createdBy: req.user._id,
    });

    await deal.save();

    if (finalStartDate && finalEndDate) {
      const now = new Date();
      if (finalStartDate > now) {
        const delay = finalStartDate.getTime() - now.getTime();
        setTimeout(async () => {
          try {
            const currentDeal = await Deal.findById(deal._id);
            if (currentDeal && currentDeal.status === "pending") {
              currentDeal.status = "active";
              await currentDeal.save();
              console.log("Scheduled activation: Deal automatically activated at startDate.", currentDeal);
            }
          } catch (error) {
            console.error("Error during scheduled activation:", error);
          }
        }, delay);
      }
    }

    return sendResponse(res, 201, true, deal, null, "Deal created successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = createDeal;