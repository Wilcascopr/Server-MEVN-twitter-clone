const router = require('express').Router();
const { handleRegistration, handleLogin, handleRefresh, handleLogout, getUserData } = require('../controllers/usersController');

router.post('/register', handleRegistration);
router.post('/login', handleLogin);
router.get('/refresh', handleRefresh);
router.get('/logout', handleLogout)
router.get('/userdata/:id', getUserData)

module.exports = router;