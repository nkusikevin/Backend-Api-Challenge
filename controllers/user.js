const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const sendMail = require("../utils/sendMail");
const Users = require("../database/users.model");
const Token = require("../database/tokens.model");
const {codeGenerator} = require('../utils/codeGenerator')

//@desc Register newuser
//@route Post /api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password,phone } = req.body;
	const userExits = await Users.findOne({ email });
	if (userExits) {
		res.status(400);
		throw new Error("User already exists ");
	}
	const code = await codeGenerator();
	const user = await Users.create({
		name,
		email,
		phone,
		password,
		code
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			phone:user.phone,
			code:user.code
		});
		let token = await new Token({
			userId: user._id,
			token: generateToken(user._id),
		}).save();

		const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
		await sendMail(user.email, "Verify Email", message);
		res.setHeader("Content-Type", "text/plain");
		send("An Email sent to your account please verify");
	} else {
		res.status(400);
		throw new Error("invalid user data");
	}
});

//@desc  Delete user
//@route Get /api/users/delete/:id
//@access Private

const deleteUser = asyncHandler(async (req, res) => {
	const user = await Users.findById(req.params.id);
	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}
	await Users.findByIdAndDelete(req.params.id);
	res.status(200).json({
		message: "User deleted successfully",
	});
});

//@desc  Update user
//@route Put /api/users/update/:id
//@access Private

const updateUser = asyncHandler(async (req, res) => {
	const user = await Users.findById(req.params.id);
	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}
	const { name, email, password } = req.body;
	const userExits = await Users.findOne({ email });
	if (userExits) {
		res.status(400);
		throw new Error("User already exists ");
	}
	const updatedUser = await Users.findByIdAndUpdate(req.params.id, {
		name,
		email,
		password,
	});
	if (updatedUser) {
		res.status(200).json({ message: "User updated successfully" });
	} else {
		res.status(400);
		throw new Error("invalid user data");
	}
});

const searchUser = asyncHandler(async (req, res) => {
	const { search } = req.body;
	const user = await Users.find({
		$or: [
			{ name: search },
			{ position: search },
			{ phone: search },
			{ code: search },
			{ email: search },
		],
	});

	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}
	res.status(200).json({
		message: "List of employees found",
		status: 201,
		employees: user,
	});
});

const suspendUser = asyncHandler(async (req, res) => {
	const user = await Users.findById(req.params.id);
	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}
	const updatedUser = await Users.findByIdAndUpdate(req.params.id, {
		isSuspended: true,
	});
	if (updatedUser) {
		res.status(200).json({ message: "User suspended successfully" });
	} else {
		res.status(400);
		throw new Error("invalid user data");
	}
});

module.exports = {
	registerUser,
	deleteUser,
	updateUser,
	searchUser,
	suspendUser
};
