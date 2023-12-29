require("dotenv").config();

const http = require("http");
const app = require("app");
//creating server
const server = http.createServer(app);
const port = Number(process.env.PORT || 3003);

//starting server
server.listen(port, () => {
    console.log("Application is running on port ", port);
});