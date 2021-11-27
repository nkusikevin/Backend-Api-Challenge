const mongoose = require("mongoose");
const { v4  } = require("uuid");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		isManager: {
			type: Boolean,
			required: true,
			default: false,
		},
		verified: {
			type: Boolean,
			required: true,
			default: false,
		},
		suspended: {
			type: Boolean,
			required: true,
			default: false,
		},
		activated: {
			type: Boolean,
			required: true,
			default: false,
		},
		code: {
			type: String,
			default: v4(),
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});
const User = mongoose.model("User", userSchema);
module.exports = User;
