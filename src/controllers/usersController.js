const bcrypt = require('bcrypt');
const User = require('../models/User');
const keys = require('../config/keys')
const jwt = require('jsonwebtoken')

const handleRegistration = async (req, res) => {
    // check for duplicates
    const { name, email, password } = req.body;
    const user = await User.findOne({ email })

    if (user) return res.status(400).json({ "message": "A user has already registered with this email"});

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPwd,
        refreshToken: ''
    })
    try {
        await newUser.save()
        res.json({"message": "Welcome, Sign up successful"})
    } catch(err) {
        res.sendStatus(500)
    }
}



const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ "message": "This user does not exist" });

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        const accessToken = jwt.sign(
            { "email": email },
            keys.AccessTokenSecret,
            { expiresIn: '30m'}
        )

        const refreshToken = jwt.sign(
            { "email": email },
            keys.RefreshTokenSecret,
            { expiresIn: '1d'}
        )

        user.refreshToken = refreshToken;

        await user.save()

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 60*60*24*1000, sameSite: 'None' })

        res.json({ "expiresIn": 30*60*60, accessToken })

    } else {
        return res.status(400).json({"message": "Incorrect password"});
    }

}

const handleRefresh = async (req, res) => {

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(403).json({ "message": "Invalid"})

    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken })

    if (user) {
        jwt.verify(
            refreshToken,
            keys.RefreshTokenSecret,
            (err, decoded) => {
                if (err || decoded.email !== user.email) return res.status(403).json({ "message": "Invalid"});
                const accessToken = jwt.sign(
                    { "email": user.email },
                    keys.AccessTokenSecret,
                    { expiresIn: '30m'}
                )
    
                res.json({
                    userID: user.id,
                    name: user.name, 
                    email: user.email, 
                    followers: user.followers, 
                    following: user.following,
                    bio: user.bio,
                    accessToken
                })
            }
        )
    } else {
        return res.status(403).json({ "message": "Invalid"});
    }

}

const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(403).json({ "message": "Invalid"})

    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken })

    if (!user) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
        return res.sendStauts(204)
    }

    user.refreshToken = '';

    await user.save();

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    res.status(204).send('logout successful')

}

const getUserData = async (req, res) => {

    const id = req.params.id;

    if (!id) return res.status(400).json({ "message": "Invalid"})

    const user = await User.findById(id);

    if (user) {
        res.json({userID: user.id,name: user.name, email: user.email, followers: user.followers, following: user.following, bio: user.bio})
    } else {
        return res.status(403).json({ "message": "Invalid"});
    }
}

const updateUser = async (req, res) => {

    const { id, name, bio } = req.body;


    if (!name && !bio) return res.sendStatus(400);

    try {

        await User.findByIdAndUpdate(id, { name, bio });
        const user = await User.findById(id)

        res.json({userID: user.id,name: user.name, email: user.email, followers: user.followers, following: user.following, bio: user.bio})

    } catch(err) {

        return res.sendStatus(500)

    }

}

const handleFollow = async (req, res) => {
    const { userFollowing, userFollowed } = req.body;

    
    if (!userFollowed || !userFollowing) return res.sendStatus(400);

    try {

        await User.findByIdAndUpdate(userFollowed.id, { followers: userFollowed.followers });
        await User.findByIdAndUpdate(userFollowing.id, { following: userFollowing.following });

    } catch (err) {

        return res.sendStatus(404);
    }

}

const handleUsers = async (req, res) => {
    
    const users = await User.find().sort({ followers: -1 });

    if (!users) return res.sendStatus(500);

    res.json(users);

}

module.exports = { handleRegistration, handleLogin, handleRefresh, handleLogout, getUserData, updateUser, handleFollow, handleUsers }