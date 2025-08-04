const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

const saltRounds = 10;

// Render the sign up page
exports.getSignUp = (req, res) => {
    res.render('pages/signup', { message: null });
};

// Email transporter setup
let transporter = null;

// Only create transporter if email credentials are configured
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

// Handles sign up logic
exports.postSignUp = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.render('pages/signup', { message: 'Email already registered' });
        }

        // Create new user
        const userData = {
            first_name,
            last_name,
            email,
            password,
            role: 'user' // Default role
        };

        await userModel.createUser(userData);
        
        req.session.success = 'Registration successful! You can now log in.';
        res.redirect('/login');
    } catch (error) {
        console.error('Error during sign up:', error);
        res.render('pages/signup', { message: 'An error occurred during registration. Please try again.' });
    }
};

// Email verification route
exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // For simplicity, we'll just redirect to login since we're not using email verification
        res.redirect('/login?verified=true');
    } catch (error) {
        console.error('Email verification error:', error);
        res.redirect('/login?error=invalid_token');
    }
};

// Get login page
exports.getLogin = (req, res) => {
    res.render('pages/login', { message: null });
};

// Handle login logic
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.render('pages/login', { message: 'Invalid email or password' });
        }

        if (!user.is_verified) {
            return res.render('pages/login', { message: 'Account is not verified. Please contact administrator.' });
        }

        const isPasswordValid = await userModel.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.render('pages/login', { message: 'Invalid email or password' });
        }

        // Store user in session
        req.session.user = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role
        };

        // Redirect based on user role
        if (user.role === 'admin') {
            res.redirect('/admin/tasks');
        } else {
            res.redirect('/user/dashboard');
        }

    } catch (error) {
        console.error('Error during login:', error);
        res.render('pages/login', { message: 'An error occurred during login. Please try again.' });
    }
};

// Render forgot password page
exports.getForgotPassword = (req, res) => {
    res.render('pages/forgot-password', { message: null });
};

// Handles forgot password logic
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.render('pages/forgot-password', { message: 'Email not registered' });
        }

        // Check if email service is configured
        if (!transporter) {
            return res.render('pages/forgot-password', { 
                message: 'Email service is not configured. Please contact administrator for password reset.' 
            });
        }

        // Generate reset token
        const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send reset email
        const resetLink = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: `Task Management System <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset',
            html: `<p>Hi ${user.first_name},</p>
                   <p>You requested a password reset. Click the link below to reset your password:</p>
                   <a href="${resetLink}">Reset Password</a>
                   <p>If you did not request this, please ignore this email.</p>`
        };

        await transporter.sendMail(mailOptions);
        res.render('pages/forgot-password', { message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        
        // Check if it's an email configuration error
        if (error.code === 'EAUTH' || error.message.includes('credentials')) {
            res.render('pages/forgot-password', { 
                message: 'Email service is not configured. Please contact administrator for password reset.' 
            });
        } else {
            res.render('pages/forgot-password', { message: 'An error occurred. Please try again.' });
        }
    }
};

// Render reset password page
exports.getResetPassword = (req, res) => {
    const { token } = req.query;
    res.render('pages/reset-password', { token, message: null });
};

// Reset password logic
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findUserByEmail(decoded.email);
        if (!user) {
            return res.render('pages/reset-password', { message: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password
        await userModel.updateUser(user.id, { password: hashedPassword });

        res.render('pages/reset-password', { message: 'Password reset successful! You can now log in.', token: '' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.render('pages/reset-password', { message: 'Invalid or expired token' });
    }
};

// Logout logic
exports.logoutUser = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).send('An error occurred while logging out.');
    }
};
