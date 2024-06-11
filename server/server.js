const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const app=express();
const routes = require("./routes/route")
const connectToDatabase = require("./utils/db");
const { PORT } = require("./config/config");
const startConsumers = require("./utils/startConsumer")

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

connectToDatabase();
startConsumers();


/*Routes*/
app.use(routes);




app.listen(PORT,()=>{
console.log("Server is running on port 8000");
})