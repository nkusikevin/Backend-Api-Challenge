const mongoose = require("mongoose");
import { v4 as uuidv4 } from "uuid";
const bcrypt = require("bcrypt");
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
            default: false
        },
		code: {
			type: Number,
			default: uuidv4(),
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
