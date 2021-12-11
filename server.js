express = require("express");
require("dotenv").config()
require("./database/config");
port = process.env.PORT || 5000;
const app = express();
const userRouter = require("./routes/user");
const verifyUser = require("./routes/verifyUser");
const manager = require('./routes/manager')
app.use(express.json());
app.use("/api/Employe", userRouter);
app.use("/api/manager",manager)
app.use("/user", verifyUser);



app.listen(port, () => {
    console.log("Server is running on port 5000");});