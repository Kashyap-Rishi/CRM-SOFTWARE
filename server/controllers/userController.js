const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");
const User = require('../models/User');

const addUsers = async (req, res) => {
  const users = req.body;

  try {
    
    const employeeIds = users.map(user => user.employeeId);

   
    const existingUsers = await User.find({ employeeId: { $in: employeeIds } });
    const existingEmployeeIds = existingUsers.map(user => user.employeeId);

    const newUsers = users.filter(user => !existingEmployeeIds.includes(user.employeeId));

    if (newUsers.length === 0) {
      return res.status(400).json({ message: 'All users already exist' });
    }

    const insertedUsers = await User.insertMany(newUsers);

    res.status(201).json({
      message: 'Users added successfully',
      addedUsers: insertedUsers,
      existingEmployeeIds
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const fetchAllUser = async (req, res) => {
  try {
    const users = await User.find();

    sendSuccessResponse(res, 200,users);
  } catch (error) {
    console.error("Error fetching customers:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};




module.exports = { addUsers,fetchAllUser };
