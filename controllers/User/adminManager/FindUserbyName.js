const { AppEror, sendResponse } = require('../../utils');
const User = require('d:/webb/backsau/models/User');

const findUser = async (req, res, next) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      throw new AppEror(400, "Query parameter is required");
    }
    
    let user;
    if (query.match(/^[0-9a-fA-F]{24}$/)) {
      // Tìm theo ID
      user = await User.findById(query);
    } else if (query.includes('@')) {
      // Tìm theo Email
      user = await User.findOne({ email: query });
    } else {
      // Tìm theo Username (dùng regex để tìm kiếm gần đúng, không phân biệt hoa/thường)
      user = await User.findOne({ username: { $regex: query, $options: 'i' } });
    }
    
    if (!user) {
      throw new AppEror(404, "User not found");
    }

    sendResponse(res, 200, { user });
  } catch (error) {
    next(error);
  }
};

module.exports = findUser;
