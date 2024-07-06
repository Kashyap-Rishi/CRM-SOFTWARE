const express = require("express");
const { addUsers, fetchAllUser } = require("../../controllers/userController");



const router = express.Router();

router.post("/create-user",addUsers);
router.get("/fetch-user",fetchAllUser);


module.exports = router;