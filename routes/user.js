const express = require('express');
const router = express.Router();
const {registerUser,deleteUser} = require('../controllers/user');

router.route("/").post(registerUser)
router.route("/:id").delete(deleteUser)



module.exports = router;