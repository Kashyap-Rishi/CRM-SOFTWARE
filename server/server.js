const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes/route");
const connectToDatabase = require("./utils/db");
const { PORT } = require("./config/config");
const startConsumers = require("./utils/startConsumer");

const corsOptions = {
    origin: ['http://localhost:5173','https://crm-x.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectToDatabase();
startConsumers();

app.use(routes);

app.listen(PORT, () => {
  console.log("Server is running on port 8000");
});
