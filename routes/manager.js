const express = require("express");
const router = express.Router();
const { registerManager,loginManager } = require("../controllers/manager");

router.route("/").post(registerManager);
router.route("/login").post(loginManager);
module.exports = router;
