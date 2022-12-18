const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followers: {
        type: [Schema.Types.ObjectId],
        refs: 'users'
    },
    following: {
        type: [Schema.Types.ObjectId],
        refs: 'users'
    },
    bio: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    refreshToken: {
        type: String
    }
 },
)


module.exports = User = mongoose.model('user', UserSchema)