const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const sendMail = require("../utils/sendMail");
const Users = require("../database/users.model");
const Token = require("../database/tokens.model");
const codeGenerator = require("../utils/codeGenerator");

//@desc Register newuser
//@route Post /api/users/register
//@access Public
const registerManager = asyncHandler(async (req, res) => {
	const { name, email, password, phone } = req.body;
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
		code,
		isManager: true,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			code: user.code,
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


//@desc Login user
//@route Post /api/users/login
//@access Public
const loginManager = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await Users.findOne({ email });
	if (!user) {
		res.status(400);
		throw new Error("User not found");
	}
	if (user.isVerified) {
		if (user.isManager) {
			if (await user.matchPassword(password)) {
				res.status(200).json({
					_id: user._id,
					name: user.name,
					email: user.email,
					phone: user.phone,
					code: user.code,
					isManager: user.isManager,
					isVerified: user.isVerified,
					token: generateToken(user._id),
				});
			} else {
				res.status(400);
				throw new Error("Invalid password");
			}
		} else {
			res.status(400);
			throw new Error("You are not a manager");
		}
	} else {
		res.status(400);
		throw new Error("Please verify your email");
	}
});

module.exports = {
	registerManager,
	loginManager,
};
