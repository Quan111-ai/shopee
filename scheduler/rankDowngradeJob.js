// scheduler/rankDowngradeJob.js
const Agenda = require("agenda");
const User = require("../models/User");

const mongoConnectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1/SauLearn";

const agenda = new Agenda({ db: { address: mongoConnectionString, collection: "agendaJobs" } });

// Định nghĩa khoảng thời gian hiệu lực cho mỗi rank (tính theo mili-giây)
const expirationMapping = {
  "Bạc": 30 * 24 * 60 * 60 * 1000,         // 1 tháng ~ 30 ngày
  "Vàng": 90 * 24 * 60 * 60 * 1000,         // 3 tháng ~ 90 ngày
  "Kim Cương": 120 * 24 * 60 * 60 * 1000,    // 4 tháng ~ 120 ngày
};

// Định nghĩa thứ tự hạ cấp: khi vượt thời hạn, hạ bậc xuống một cấp
const downgradeMapping = {
  "Kim Cương": "Vàng",
  "Vàng": "Bạc",
  "Bạc": "Đồng",
};

agenda.define("downgrade rank", async (job) => {
  try {
    const currentDate = Date.now();
    const users = await User.find({ rank: { $in: ["Bạc", "Vàng", "Kim Cương"] } });
    
    for (const user of users) {
      if (!user.rankUpdatedAt) continue;
      const lastUpdate = new Date(user.rankUpdatedAt).getTime();
      const expirationTime = expirationMapping[user.rank];
      
      if (currentDate - lastUpdate > expirationTime) {
        // Hạ cấp nếu có mapping
        const newRank = downgradeMapping[user.rank];
        if (newRank) {
          user.rank = newRank;
          // Cập nhật lại rankUpdatedAt sau khi hạ cấp
          user.rankUpdatedAt = new Date();
          await user.save();
          console.log(`User ${user._id} downgraded to ${newRank}`);
        }
      }
    }
  } catch (error) {
    console.error("Error in downgrade rank job:", error);
  }
});

// Lập lịch chạy job này vào lúc 00:00 mỗi ngày
(async function () {
  await agenda.start();
  await agenda.every("0 0 * * *", "downgrade rank");
  console.log("Agenda job scheduled to downgrade rank at midnight every day.");
})();

module.exports = agenda;