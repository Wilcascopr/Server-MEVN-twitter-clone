const router = require('express').Router();
const { handleNewTweet, handleGetTweets, handleUserTweets, handleGetTweet } = require('../controllers/tweetsController');
const verifyJWT = require('../middleware/verifyJWT')

router.route('/create').post(verifyJWT, handleNewTweet)
router.get('/:page', handleGetTweets)
router.get('/user/:user_id', handleUserTweets);
router.get('/:tweet_id', handleGetTweet)

module.exports = router;