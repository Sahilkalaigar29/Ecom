const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isValidToken } = require('../middlewares/auth');

router.get('/', isValidToken, userController.getAllUsers);
router.get('/:id', isValidToken, userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', isValidToken, userController.updateUser);
router.delete('/:id', isValidToken, userController.deleteUser);
router.post('/loginWithEmailPassword', userController.loginWithEmailPassword);
router.post('/loginWithPhonePassword', userController.loginWithPhonePassword);

module.exports = router;
