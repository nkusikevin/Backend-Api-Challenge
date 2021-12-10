const express = require('express');
const router = express.Router();
const { registerUser, deleteUser, updateUser,searchUser } = require("../controllers/user");

router.route("/").post(registerUser)
router.route("/:id").delete(deleteUser).put(updateUser)
router.route("/find").get(searchUser)




module.exports = router;