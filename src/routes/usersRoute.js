const router = require('express').Router();
const { handleRegistration, 
    handleLogin, 
    handleRefresh,
    handleLogout, 
    getUserData, 
    updateUser, 
    handleFollow,
    handleUsers } = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT')

router.route('/update').put(verifyJWT, updateUser)
router.route('/follow').put(verifyJWT, handleFollow)
router.post('/register', handleRegistration);
router.post('/login', handleLogin);
router.get('/', handleUsers);
router.get('/refresh', handleRefresh);
router.get('/logout', handleLogout)
router.get('/userdata/:id', getUserData)

module.exports = router;