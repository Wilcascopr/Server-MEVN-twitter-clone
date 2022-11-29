const Tweet = require('../models/Tweet');
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const keys = require('../config/keys')

const handleNewTweet = async (req, res) => {
    const { text, tags } = req.body;
    
    if (!req.cookies?.jwt) return res.status(400).json({ "message": "A user has already registered with this email"});
    const refreshToken = req.cookies.jwt

    if ( !text ) return res.status(400).json({ "message": "A user has already registered with this email"});

    try {

        const authUser = await User.findOne({ refreshToken });

        const newTweet = new Tweet({
            user: authUser.id,
            text,
            tags,
            likes: 0
        })

        await newTweet.save()

        res.json(newTweet)

    } catch(error) {

        res.json({ "message": "A user has already registered with this email"})

    }
        
}   

const handleGetTweets = async (req, res) => {
    const page = req.params.page;
    let paging = 50;
    
    const tweets = await Tweet.find().sort({ date: -1 });

    if (paging > tweets.length - page) paging = tweets.length;

    if (!tweets) return res.sendStatus(500);

    res.json(tweets.slice(page, page + paging))
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