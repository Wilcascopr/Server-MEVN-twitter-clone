require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGO_URI,
    AccessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    RefreshTokenSecret: process.env.REFRESH_TOKEN_SECRET
}


