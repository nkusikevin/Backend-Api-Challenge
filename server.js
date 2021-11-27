express = require("express");
const app = express()
port = process.env.PORT || 5000;







app.listen(port, () => {
    console.log("Server is running on port 5000");});