const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        req.session.error = 'Access denied. Admin privileges required.';
        return res.redirect('/login');
    }
    next();
};

// Admin Dashboard Routes
router.get('/admin/dashboard', requireAdmin, taskController.renderTaskDashboard);
router.get('/admin/users', requireAdmin, userController.renderUserManagement);

// Admin User Management Routes
router.post('/admin/users/:id/toggle-verification', requireAdmin, userController.toggleUserVerification);
router.get('/admin/users/:id/delete', requireAdmin, userController.deleteUser);

// Admin Task Routes
router.get('/admin/tasks', requireAdmin, taskController.renderTaskDashboard);
router.get('/admin/tasks/add', requireAdmin, taskController.renderAddTask);
router.post('/admin/tasks/add', requireAdmin, taskController.createTask);
router.get('/admin/tasks/edit/:id', requireAdmin, taskController.renderEditTask);
router.post('/admin/tasks/edit/:id', requireAdmin, taskController.updateTask);
router.post('/admin/tasks/delete/:id', requireAdmin, taskController.deleteTask);
router.post('/admin/tasks/:id/status', requireAdmin, taskController.updateTaskStatus);
router.get('/admin/tasks/:id', requireAdmin, taskController.getTaskDetails);
router.post('/admin/tasks/:id/comment', requireAdmin, taskController.addTaskComment);
router.get('/admin/tasks/status/:status', requireAdmin, taskController.getTasksByStatus);
router.get('/admin/tasks/overdue', requireAdmin, taskController.getOverdueTasks);

// User Dashboard and Task Routes
router.get('/user/dashboard', requireAuth, taskController.renderUserDashboard);
router.get('/user/tasks', requireAuth, taskController.renderUserTaskDashboard);
router.get('/user/tasks/:id', requireAuth, taskController.renderUserTaskDetails);
router.post('/user/tasks/:id/status', requireAuth, taskController.userUpdateTaskStatus);

// User Profile Routes
router.get('/profile', requireAuth, userController.renderUserProfile);
router.post('/profile/update', requireAuth, userController.updateUserProfile);
router.post('/profile/change-password', requireAuth, userController.changeUserPassword);

module.exports = router; 