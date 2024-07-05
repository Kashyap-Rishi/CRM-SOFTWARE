const Project = require('../../models/Project');
const User = require('../../models/user');


const createProject = async (req, res) => {
  const { name, deadline, userEmployeeIds } = req.body;

  try {
   
    const users = await User.find({ employeeId: { $in: userEmployeeIds } });

    if (users.length !== userEmployeeIds.length) {
      return res.status(400).json({ message: 'Some users not found' });
    }

 
    const project = new Project({
      name,
      deadline,
      users: users.map(user => user._id),
    });

    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = { createProject };
