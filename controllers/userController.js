const userModel = require('../models/userModel');

// Render user management page
const renderUserManagement = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        
        res.render('admin/userManagement', {
            users,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error rendering user management:', error);
        res.status(500).render('error', { error: 'Internal server error' });
    }
};

// Get all users for API
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findUserById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { first_name, last_name, email, role, is_verified } = req.body;
        
        const userData = {
            first_name,
            last_name,
            email,
            role,
            is_verified
        };
        
        const updatedUser = await userModel.updateUser(userId, userData);
        
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        req.session.success = 'User updated successfully';
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error updating user:', error);
        req.session.error = 'Error updating user';
        res.redirect('/admin/users');
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Prevent admin from deleting themselves
        if (parseInt(userId) === req.session.user.id) {
            req.session.error = 'Cannot delete your own account';
            return res.redirect('/admin/users');
        }
        
        const deleted = await userModel.deleteUser(userId);
        
        if (deleted) {
            req.session.success = 'User deleted successfully';
        } else {
            req.session.error = 'User not found';
        }
        
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        req.session.error = 'Error deleting user';
        res.redirect('/admin/users');
    }
};

// Toggle user verification status
const toggleUserVerification = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedUser = await userModel.toggleUserVerification(userId);
        
        res.json({ 
            success: true, 
            message: `User ${updatedUser.is_verified ? 'verified' : 'unverified'} successfully`,
            is_verified: updatedUser.is_verified
        });
    } catch (error) {
        console.error('Error toggling user verification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Render user profile page
const renderUserProfile = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const user = await userModel.findUserById(userId);
        
        if (!user) {
            req.session.error = 'User not found';
            return res.redirect('/user/dashboard');
        }
        
        res.render('user/profile', {
            user: req.session.user,
            profileData: user
        });
    } catch (error) {
        console.error('Error rendering user profile:', error);
        res.status(500).render('error', { error: 'Internal server error' });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { first_name, last_name, email } = req.body;
        
        // Validation
        if (!first_name || !last_name || !email) {
            req.session.error = 'All fields are required';
            return res.redirect('/profile');
        }
        
        // Check if email is already taken by another user
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser && existingUser.id !== parseInt(userId)) {
            req.session.error = 'Email is already taken';
            return res.redirect('/profile');
        }
        
        const userData = {
            first_name,
            last_name,
            email,
            role: req.session.user.role,
            is_verified: req.session.user.is_verified
        };
        
        const updatedUser = await userModel.updateUser(userId, userData);
        
        // Update session with new user data
        req.session.user = {
            id: updatedUser.id,
            email: updatedUser.email,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            role: updatedUser.role
        };
        
        req.session.success = 'Profile updated successfully';
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating user profile:', error);
        req.session.error = 'Error updating profile';
        res.redirect('/profile');
    }
};

// Change user password
const changeUserPassword = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const { current_password, new_password, confirm_password } = req.body;
        
        // Validation
        if (!current_password || !new_password || !confirm_password) {
            req.session.error = 'All password fields are required';
            return res.redirect('/profile');
        }
        
        if (new_password !== confirm_password) {
            req.session.error = 'New passwords do not match';
            return res.redirect('/profile');
        }
        
        if (new_password.length < 6) {
            req.session.error = 'Password must be at least 6 characters long';
            return res.redirect('/profile');
        }
        
        // Get current user to verify current password
        const user = await userModel.findUserById(userId);
        if (!user) {
            req.session.error = 'User not found';
            return res.redirect('/profile');
        }
        
        // Verify current password
        const isCurrentPasswordValid = await userModel.verifyPassword(current_password, user.password);
        if (!isCurrentPasswordValid) {
            req.session.error = 'Current password is incorrect';
            return res.redirect('/profile');
        }
        
        // Update password
        await userModel.updateUserPassword(userId, new_password);
        
        req.session.success = 'Password changed successfully';
        res.redirect('/profile');
    } catch (error) {
        console.error('Error changing password:', error);
        req.session.error = 'Error changing password';
        res.redirect('/profile');
    }
};

module.exports = {
    renderUserManagement,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleUserVerification,
    renderUserProfile,
    updateUserProfile,
    changeUserPassword
}; 