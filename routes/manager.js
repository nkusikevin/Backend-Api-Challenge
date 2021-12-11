const express = require("express");
const router = express.Router();
const { registerManager } = require("../controllers/manager");

router.route("/").post(registerManager);

module.exports = router;
