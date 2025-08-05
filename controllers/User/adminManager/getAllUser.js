const { AppEror, sendResponse } = require('../../utils');
const User = require('../../models/User');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("username email phoneNumber address rank role createdAt");
    
    if (!users.length) {
      throw new AppEror(404, "No users found");
    }
    
    sendResponse(res, 200, { users });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllUsers;
