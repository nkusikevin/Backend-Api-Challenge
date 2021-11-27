const express = require('express');
const router = express.Router();
const {registerUser} = require('../controllers/user');

router.route("/").post(registerUser)



module.exports = router;