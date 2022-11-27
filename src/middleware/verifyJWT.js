const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const verifyJWT = (req, res, next) => {

    const authHeader = req.headers["authorization"];

    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];

    jwt.verify(token,
        keys.AccessTokenSecret,
        (err, decoded) => {
            if (err) return res.sendStatus(403);
            next()
        });

}

module.exports = verifyJWT;