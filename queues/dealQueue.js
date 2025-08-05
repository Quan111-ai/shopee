// queues/dealQueue.js

/**
 * Vì bạn không muốn sử dụng Redis và BullMQ nữa,
 * chúng ta thay thế bằng một "dummy queue" để mô phỏng quá trình thêm và xử lý job.
 *
 * Lưu ý: Giải pháp này sẽ xử lý ngay lập tức khi job được thêm vào,
 * không có khả năng lưu lại hay xử lý bất đồng bộ như một hàng đợi thực sự.
 * Nếu bạn cần xử lý bất đồng bộ hoặc duy trì job, bạn sẽ cần một giải pháp thay thế.
 */

const processDeal = async (job) => {
    const { dealId, userId } = job.data;
    console.log(`(Dummy Queue) Processing deal ${dealId} for user ${userId}`);
    // Thực hiện logic xử lý deal ở đây...
    // Ví dụ: giảm số lượng ưu đãi, cập nhật trạng thái,...
  };
  
  // Hàm thêm job vào "dummy queue"
  const addJobToQueue = async (jobName, data) => {
    console.log(`(Dummy Queue) Job "${jobName}" added with data:`, data);
    // Ở đây chúng ta xử lý job ngay lập tức (không lưu giữ hay đợi xử lý sau)
    await processDeal({ data });
  };
  
  module.exports = { addJobToQueue };