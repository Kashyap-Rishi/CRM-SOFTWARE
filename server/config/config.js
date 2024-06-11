require("dotenv").config();

module.exports = {
  RABBITMQ_URI: process.env.RABBITMQ_URI,
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 3000,
};
