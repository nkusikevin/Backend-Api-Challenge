const express = require('express');
const router = express.Router();
const { registerUser, deleteUser, updateUser } = require("../controllers/user");

router.route("/").post(registerUser)
router.route("/:id").delete(deleteUser).put(updateUser)





module.exports = router;