const { AppEror, sendResponse } = require('../../utils');
const User = require('d:/webb/backsau/models/User');

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppEror(400, "Invalid user ID");
    }

    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      throw new AppEror(404, "User not found");
    }

    sendResponse(res, 200, { message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteUser;
