const express = require('express');
const router = express.Router();
const {
	registerUser,
	deleteUser,
	updateUser,
	searchUser,
	suspendUser,
} = require("../controllers/user");

router.route("/").post(registerUser)
router.route("/:id").delete(deleteUser).put(updateUser)
router.route("/find").get(searchUser)
router.route("/suspend/:id").put(suspendUser);




module.exports = router;