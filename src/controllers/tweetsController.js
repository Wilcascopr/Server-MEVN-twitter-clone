const Tweet = require('../models/Tweet');
const User = require('../models/User')

const handleNewTweet = async (req, res) => {
    const { text, tags } = req.body;
    
    if (!req.cookies?.jwt) res.status(400).send('You have to be logged in to tweet');
    const refreshToken = req.cookies.jwt

    if ( !text || tags.length === 0 ) res.status(400).send('Invalid tweet');

    const authUser = await User.findOne({ refreshToken });

    if (!authUser) return res.status(400).send('You have to be logged in to tweet');

    jwt.verify(
        refreshToken,
        keys.RefreshTokenSecret,
        async (err, decoded) => {
            if (err || decoded.email !== authUser.email) return res.status(403).json({ "message": "Invalid"});

            const newTweet = new Tweet({
                user: authUser.id,
                text,
                tags
            })

            await newTweet.save()

            res.sendStatus(200)
        }
    )
        
}   

const handleGetTweets = async (req, res) => {
    const tweets = await Tweet.find().sort({ date: -1 })

    if (!tweets) return res.sendStatus(500);

    res.json(tweets)
}

const handleUserTweets = async (req, res) => {
    const tweets = Tweet.find({ user: req.params.user_id });

    if (!tweets) return res.sendStatus(400);

    res.json(tweets);
}

const handleGetTweet = async (req, res) => {
    const tweet = await Tweet.findById(req,params.id);

    if (!tweet)  return res.sendStatus(400);

    res.json(tweet)
}

module.exports = { handleNewTweet, handleGetTweets, handleUserTweets, handleGetTweet };