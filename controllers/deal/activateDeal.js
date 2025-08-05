// controllers/deal/activateDeal.js
const Deal = require("../../models/Deal");
const { AppError, sendResponse } = require("../../helpers/utils");

const activateDeal = async (req, res, next) => {
  try {
    // Chỉ cho phép seller, admin hoặc staff kích hoạt deal
    if (!req.user || !["seller", "admin", "staff"].includes(req.user.role)) {
      throw new AppError(403, "You are not authorized to activate a deal.");
    }

    // Nếu có tham số dealId trong req.params, kích hoạt riêng một deal
    if (req.params.id) {
      const dealId = req.params.id;
      const deal = await Deal.findById(dealId);
      if (!deal) {
        throw new AppError(404, "Deal not found.");
      }

      // Nếu người dùng là seller, chỉ được kích hoạt các deal do chính họ tạo
      if (req.user.role === "seller" && !deal.createdBy.equals(req.user._id)) {
        throw new AppError(403, "You can only activate deals created by you.");
      }

      // Chỉ cho phép kích hoạt các deal đang ở trạng thái pending
      if (deal.status !== "pending") {
        throw new AppError(400, "Only pending deals can be activated.");
      }

      if (!deal.durationInHours || deal.durationInHours <= 0) {
        throw new AppError(400, "Deal does not have a valid duration set.");
      }

      const now = new Date();
      const calculatedEndDate = new Date(now.getTime() + deal.durationInHours * 3600000);
      deal.startDate = now;
      deal.endDate = calculatedEndDate;
      deal.status = "active";
      deal.activatedAt = now; // Lưu thời gian kích hoạt (tuỳ chọn)
      await deal.save();

      return sendResponse(
        res,
        200,
        true,
        deal,
        null,
        "Deal activated successfully."
      );
    } else {
      // --- Bulk mode: Không có dealId, tự động lấy tất cả các deal đang pending ---
      let query = { status: "pending" };
      // Nếu người dùng là seller, chỉ kích hoạt (và xem) các deal do chính họ tạo
      if (req.user.role === "seller") {
        query.createdBy = req.user._id;
      }
      const pendingDeals = await Deal.find(query);
      if (!pendingDeals || pendingDeals.length === 0) {
        return sendResponse(
          res,
          200,
          true,
          [],
          null,
          "No pending deals to display."
        );
      }

      // Kiểm tra query parameter 'action'
      // Nếu có action=activate thì sẽ kích hoạt toàn bộ các deal pending
      if (req.query.action && req.query.action === "activate") {
        const now = new Date();
        const activatedDeals = [];
        for (let deal of pendingDeals) {
          if (!deal.durationInHours || deal.durationInHours <= 0) {
            continue; // bỏ qua các deal không có duration hợp lệ
          }
          const calculatedEndDate = new Date(now.getTime() + deal.durationInHours * 3600000);
          deal.startDate = now;
          deal.endDate = calculatedEndDate;
          deal.status = "active";
          deal.activatedAt = now;
          await deal.save();
          activatedDeals.push(deal);
        }
        return sendResponse(
          res,
          200,
          true,
          activatedDeals,
          null,
          "All pending deals activated successfully."
        );
      } else {
        // Nếu không có action=activate, chỉ trả về danh sách pending deals để hiển thị
        return sendResponse(
          res,
          200,
          true,
          pendingDeals,
          null,
          "List of pending deals retrieved successfully."
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = activateDeal;