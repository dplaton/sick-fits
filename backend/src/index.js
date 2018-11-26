require('dotenv').config({ path: 'variables.env' });
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// express middleware to handle cookies
server.express.use(cookieParser());

// express middleware to decode JWT (https://jwt.io/)
server.express.use((req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const { user } = jwt.verify(token, process.env.APP_SECRET);
        req.userId = user;
    }
    next();
});

server.start(
    {
        cors: {
            credentials: true,
            origin: process.env.FRONTEND_URL
        }
    },
    data => {
        console.log(`Server running on http://localhost:${data.port}`);
    }
);
