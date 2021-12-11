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
module.exports = {
	registerManager,
};
