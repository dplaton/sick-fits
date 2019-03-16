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

// express middleware to store the user in each request
server.express.use(async (req, res, next) => {
    if (!req.userId) {
        return next()
    }

    const theUser = await db.query.user({
        where: {
            id: req.userId
        }
    }, '{id, permissions, email, name}');

    req.user = theUser;
    next();
})
console.log(`Using frontend_url ${process.env.FRONTEND_URL}`);

server.start(
    // pass the CORS options here
    {
        cors: {
            credentials: true,
            origin: [process.env.FRONTEND_URL]
        }
    },
    // we get a callback function with a data object after the server starts
    data => {
        console.log(`Server running on http://localhost:${data.port}`);
    }
);
