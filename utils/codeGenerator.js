const User = require("../database/users.model");
const asyncHandler = require("express-async-handler");
const codeGenerator = asyncHandler(async () => {
	let a = 1;
	do {
		let arr = [];
		for (let i = 0; i < 11; ++i) {
			let x = Math.floor(Math.random() * 11);
			if (!arr.includes(x)) {
				arr.push(x);
			}
			if (arr.length == 4) {
				break;
			}
		}
		const code = "KN" + arr.join("");
		// code.toString()
		console.log(code);
		const codes = await User.findOne({ code });
		if (codes.length < 1) {
			a = 0;
			return code;
		}
	} while (a);
});

module.exports = { codeGenerator };
