const mongoose = require('mongoose');
const db = require('./keys').mongoURI;

const connectDB = async () => {
    try {
        mongoose.connect(db, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch(error) {
        console.log(error)
    }
}

module.exports = connectDB;