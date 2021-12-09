const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
	{
		name: {
			desc: "The user's name.",
			trim: true,
			type: String,
			required: true,
		},
		code: {
			desc: "The user's generated code.",
			trim: true,
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			desc: "The user's phone.",
			trim: true,
			type: String,
			required: true,
		},
		email: {
			desc: "The user's email address.",
			trim: true,
			type: String,
			index: true,
			unique: true,
			required: true,
		},
		isManager: {
			desc: "Manager's position",
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
