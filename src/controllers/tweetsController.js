const Tweet = require('../models/Tweet');
const User = require('../models/User');

const handleNewTweet = async (req, res) => {
    const { text, tags } = req.body;
    
    if (!req.cookies?.jwt) return res.status(400).json({ "message": "You need to be logged in to post"});
    const refreshToken = req.cookies.jwt

    if ( !text ) return res.status(400).json({ "message": "Please fill the text field"});

    try {

        const authUser = await User.findOne({ refreshToken });

        const newTweet = new Tweet({
            user: authUser.id,
            text,
            tags,
        })

        await newTweet.save()

        res.json(newTweet)

    } catch(error) {

        res.json({ "message": "A user has already registered with this email"})

    }
        
}  

const  handleLikesandContent = async (req, res) => {

    const { _id, likes, text } = req.body;
    
    if ( !likes || !text) return res.status(400).json({ "message": "Bad request"});

    try {

        await Tweet.findByIdAndUpdate(_id, { likes, text })
        
        res.json({'message': 'updated succsesfully'})

    } catch(error) {

        res.json({ "message": "There was an error finding that tweet"})

    }

}

const handleGetTweets = async (req, res) => {
    const page = req.params.page;
    let paging = 20;
    
    const tweets = await Tweet.find().sort({ date: -1 });

    if (paging > tweets.length - page) paging = tweets.length;

    if (!tweets) {
        return res.sendStatus(500)
    } else {
        res.json(tweets.slice(page, page + paging))
    }

}

const handleUserTweets = async (req, res) => {
    
    const user = req.params.id;

    if (!user) return res.status(400).send('bad request');

    const tweets = await Tweet.find({ user });

    if (!tweets) return res.sendStatus(400);

    res.json(tweets);
}

const handleGetTweet = async (req, res) => {
      
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) return res.sendStatus(400);

    res.json(tweet)
}


const handleResponse = async (req, res) => {

    const id = req.params.id;
    const { text, tags} = req.body;

    if (!id || !text) return res.sendStatus(400);

    if (!req.cookies?.jwt) return res.status(400).json({ "message": "You need to be logged in to post"});
    const refreshToken = req.cookies.jwt

    const tweet = await Tweet.findById(id);

    if (!tweet) return res.sendStatus(400)

    const user = await User.findOne( { refreshToken } );

    if (!user) return res.sendStatus(403)

    try {

        const newTweet = new Tweet({
            user: user.id,
            text,
            tags
        });

        await newTweet.save()

        tweet.comments.push(newTweet.id)

        await tweet.updateOne({ comments: tweet.comments })

        res.json({'response': 'response sucessfully done'})

    } catch(err) {

        res.sendStatus(500)

    }

}


const handleReplyTweets = async (req, res) => {
    const tweetsID = req.body.tweets;

    const tweets = [];

    tweetsID.forEach(async (id) => {
        try {
            const tweet = await Tweet.findById(id)
            tweets.push(tweet)
            if (tweetsID.length === tweets.length) {
                res.json(tweets)
            }
        } catch (err) {
            res.sendStatus(500)
            throw err;
        }
    });
    
}

const handleDelete = async (req, res) => {

    const id = req.params.id;

    if (!id) return res.sendStatus(400);

    try {
        await Tweet.findByIdAndDelete(id);

        const inResponses = await Tweet.findOne({ comments: id })
        if (inResponses) {
            inResponses.comments = inResponses.comments.filter(ID => ID != id);
            console.log(inResponses.comments);
            await inResponses.updateOne({ comments: inResponses.comments });
        }

        res.json({message: 'deleted successfully'})
    } catch(err) {
        res.sendStatus(500);
    }

}

module.exports = { handleNewTweet, handleGetTweets, handleUserTweets, handleGetTweet, handleLikesandContent, handleResponse, handleReplyTweets, handleDelete };