const Users  = require("../database/users.model");
const asyncHandler = require("express-async-handler");
const codeGenerator = async () => {
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
		let txt = "KN" + arr.join("");
		const codes = await Users.find({ code: txt });
		if (codes.length < 1) {
			a = 0;
			return txt;
		}
	} while (a);
};

module.exports = {codeGenerator}
