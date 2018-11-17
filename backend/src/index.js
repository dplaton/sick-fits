require("dotenv").config({path: "variables.env"});
const cookieParser = require('cookie-parser');
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

// express middleware to handle cookies
server
    .express
    .use(cookieParser());

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
}, data => {
    console.log(`Server running on http://localhost:${data.port}`);
});
