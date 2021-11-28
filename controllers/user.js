const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const sendMail = require("../utils/sendMail");
const Users = require("../database/users.model");
const Token = require("../database/tokens.model");
const crypto = require("crypto-js");

//@desc Register newuser
//@route Post /api/users/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	const userExits = await Users.findOne({ email });
	if (userExits) {
		res.status(400);
		throw new Error("User already exists ");
	}
	const user = await Users.create({
		name,
		email,
		password,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			//    token:generateToken(user._id),
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
if(!user){
	res.status(404);
	throw new Error("User not found");
}
await Users.findByIdAndDelete(req.params.id);
res.status(200).json({
	message:"User deleted successfully"
})

});


module.exports = {
	registerUser,
	deleteUser
};
