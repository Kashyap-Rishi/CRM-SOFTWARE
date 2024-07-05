const User = require('../models/User');

// Add multiple users in bulk
const addUsers = async (req, res) => {
  const users = req.body;

  try {
    // Extract employeeIds from the request body
    const employeeIds = users.map(user => user.employeeId);

    // Find existing users with the same employee IDs
    const existingUsers = await User.find({ employeeId: { $in: employeeIds } });
    const existingEmployeeIds = existingUsers.map(user => user.employeeId);

    // Filter out users that already exist
    const newUsers = users.filter(user => !existingEmployeeIds.includes(user.employeeId));

    if (newUsers.length === 0) {
      return res.status(400).json({ message: 'All users already exist' });
    }

    // Insert new users in bulk
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

module.exports = { addUsers };
