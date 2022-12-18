const router = require('express').Router();
const { handleNewTweet, 
    handleGetTweets, 
    handleUserTweets, 
    handleGetTweet, 
    handleLikesandContent, 
    handleResponse, 
    handleReplyTweets, 
    handleDelete } = require('../controllers/tweetsController');
const verifyJWT = require('../middleware/verifyJWT')

router.get('/single/:id', handleGetTweet);
router.route('/create').post(verifyJWT, handleNewTweet);
router.route('/update').put(verifyJWT, handleLikesandContent);
router.route('/reply/:id').post(verifyJWT, handleResponse);
router.route('/delete/:id').delete(verifyJWT, handleDelete);
router.get('/:page', handleGetTweets);
router.get('/user/:id', handleUserTweets);
router.post('/replies', handleReplyTweets)

module.exports = router