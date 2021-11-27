const User = require("../database/users.model")
const Token = require("../database/tokens.model")
const asyncHandler = require("express-async-handler");

const verifyUser = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send("Invalid User link");
		
		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send("Invalid link");

		await User.updateOne({verified: true });
		await Token.findByIdAndRemove(token._id);

		res.send("email verified sucessfully");
	} catch (error) {
		res.status(400).send("An error occured");
	}
};

module.exports = verifyUser;
