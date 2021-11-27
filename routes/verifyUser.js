const express = require("express");
const router = express.Router();
const verifyUser = require("../controllers/verify");

router.route("/verify/:id/:token").get(verifyUser);

module.exports = router;
