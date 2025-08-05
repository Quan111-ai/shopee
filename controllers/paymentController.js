// controllers/paymentController.js

// Đây là hàm mô phỏng quá trình thanh toán (Mock Payment Processing)
const processPayment = async (req, res, next) => {
  try {
    // Giả sử client gửi lên các thông tin cần thiết:
    // orderId, amount, currency và paymentMethodId (các trường bạn cần để mô phỏng)
    const { orderId, amount, currency, paymentMethodId } = req.body;

    // Log để kiểm tra đầu vào
    console.log("Received payment request:", { orderId, amount, currency, paymentMethodId });

    // Giả lập quá trình xử lý (ví dụ: delay 2 giây)
    setTimeout(() => {
      // Đây là kết quả trả về giả lập của một giao dịch thành công
      return res.status(200).json({
        success: true,
        orderId: orderId,
        amount: amount,
        currency: currency,
        message: "Mock payment processed successfully (local simulation).",
        // Có thể thêm các thông tin khác như trạng thái, mã giao dịch, v.v.
      });
    }, 2000);

  } catch (error) {
    console.error("Error processing mock payment:", error);
    next(error);
  }
};

module.exports = { processPayment };