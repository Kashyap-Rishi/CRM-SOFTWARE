const express = require("express");
const { addUsers } = require("../../controllers/userController");



const router = express.Router();

router.post("/create-user",addUsers);


module.exports = router;