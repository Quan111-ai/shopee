const nodemailer = require("nodemailer");
const otpStore = new Map(); // Lưu OTP tạm thời

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore.set(email, otp);

  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: "Mã OTP đăng nhập",
    text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn trong 5 phút.`,
  });
};

exports.verifyOtp = (email, otp) => {
  return otpStore.get(email) == otp;
};