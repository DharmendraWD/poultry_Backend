const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');
const { authenticateAccessToken, authorizeSuperAdmin } = require('../middleware/auth');
const createUploader = require('../middleware/upload')

router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// optional admin-only endpoint for creating users
router.post('/create-user',
    createUploader({
      folder: 'users',
      fileType: 'image',
      fieldName: 'profileImag'
    }),
     authController.createUser);

     router.get('/get-me', authenticateAccessToken, authController.getMe);
     router.delete('/delete-user/:id', authenticateAccessToken, authorizeSuperAdmin, authController.deleteUser);

module.exports = router;