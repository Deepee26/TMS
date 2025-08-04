const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Root route
router.get('/', (req, res) => {
    res.render('pages/landing');
});

// Signup routes
router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignUp);

// Email verification route
router.get('/verify-email', authController.verifyEmail);

// Login routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

//forgot password routes
router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.forgotPassword);
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.resetPassword);

//logout route
router.get('/logout', authController.logoutUser);

module.exports = router;

