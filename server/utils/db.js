const mongoose = require("mongoose");
const { MONGO_URI } = require("../config/config");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000, 
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log('Error', error.message);
  }
};

module.exports = connectToDatabase;
