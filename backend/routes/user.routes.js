const userController = require('../controllers/user.controller');
const { Router } = require('express');
const { authenticateAccessToken, authorizeSuperAdmin } = require('../middleware/auth');

const router = Router();

router.route('/').get(
    authenticateAccessToken,
    userController.getAllUsers
)
router.route('/:id').get(
    // authenticateAccessToken,
    // authorizeSuperAdmin,
    userController.getUserById
)

module.exports = router;