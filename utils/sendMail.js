const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			auth: {
				user: "elias.ohara59@ethereal.email",
				pass: "SWWcHtCpCJVmPMEK2p",
			},
		});

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent sucessfully");
	} catch (error) {
		console.log("email not sent");
		console.log(error);
	}
};

module.exports = sendEmail;
