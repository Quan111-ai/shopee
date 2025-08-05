require("dotenv").config();
const { AppError, sendResponse } = require("d:/webb/backsau/helpers/utils");
require("express-async-errors");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Seller = require("./models/Seller"); 
const EventEmitter = require("events");
const passport = require("passport");
const Banner = require("./models/Banner");
const BannerRoutes = require("./routes/banner");
require("./auth/passport");

// ✅ Import tất cả routes
const loginRoutes = require("./routes/login");
const categoryRoutes = require("./routes/category");
const dealRoutes = require("./routes/deals");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const registerRoutes = require("./routes/register");
const cartRoutes = require("./routes/cart");
const profileRoutes = require("./routes/profile");
const payment = require("./routes/payment");
const categoryGroupRoutes = require("./routes/categoryGroup");

// ⚡ Tăng giới hạn sự kiện để tránh lỗi MaxListenersExceededWarning
EventEmitter.defaultMaxListeners = 20;

// ✅ Import Sentry để theo dõi lỗi
const Sentry = require("@sentry/node");
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const app = express();

// Mount Sentry request handler
app.use(Sentry.Handlers.requestHandler());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: "http://localhost:5173", // địa chỉ frontend (Vite)
  credentials: true
}));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ Debug biến môi trường
console.log("🔍 GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("🔍 FACEBOOK_CLIENT_ID:", process.env.FACEBOOK_CLIENT_ID);

// ✅ Cấu hình MongoDB với tự động reconnect
mongoose.set("strictQuery", true);
const mongo_URI = process.env.MONGODB_URI;

mongoose.connect(mongo_URI, { 
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

mongoose.connection.on("disconnected", async () => {
  console.error("❌ MongoDB lost connection! Reconnecting...");
  try {
    await mongoose.connect(mongo_URI);
    console.log("✅ Reconnected to MongoDB");
  } catch (err) {
    console.error("❌ Reconnect failed:", err);
  }
});

// ✅ Tạo tài khoản admin nếu chưa có
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("matkhauadmin123", 10);
      const newAdmin = new User({
        username: "admin",
        email: "admin@example.com",
        passwordHash: hashedPassword,
        role: "admin",
      });
      await newAdmin.save();
      console.log("✅ Default admin account created successfully");
    } else {
      console.log("🔍 Admin account already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  }
};


const verifyToken = (req, res, next) => {
  if (req.path.startsWith("/auth/login")) {
    return next();
  }
 const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

// ✅ API đăng nhập bằng Google
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
}));

// ✅ API đăng nhập bằng Facebook
app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

app.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
}));

// ✅ Kích hoạt tất cả routes
app.use("/login", loginRoutes);
app.use("/categories", categoryRoutes);
app.use("/deals", dealRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/register", registerRoutes);
app.use("/cart", cartRoutes);
app.use("/profile", profileRoutes);
app.use("/payment", payment);
app.use("/category-group", categoryGroupRoutes);
app.use("/banner", BannerRoutes);
// ✅ Middleware xử lý lỗi 404
app.use((req, res, next) => {
  next(new AppError(404, "Not Found"));
});

// ✅ Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  return sendResponse(
    res,
    err.statusCode || 500,
    false,
    null,
    { message: err.message },
    err.isOperational ? err.errorType : "Internal Server Error"
  );
});

module.exports = app;