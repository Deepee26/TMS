const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');

// Render task dashboard
const renderTaskDashboard = async (req, res) => {
    try {
        const tasks = await taskModel.getAllTasks();
        const stats = await taskModel.getTaskStatistics();
        
        res.render('admin/taskDashboard', {
            tasks,
            stats,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error rendering task dashboard:', error);
        res.status(500).render('error', { error: 'Internal server error' });
    }
};

// Render add task form
const renderAddTask = async (req, res) => {
    try {
        const users = await userModel.getUsersForAssignment();
        res.render('admin/addTask', {
            users,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error rendering add task form:', error);
        res.status(500).render('error', { error: 'Internal server error' });
    }
};

// Create new task
const createTask = async (req, res) => {
    try {
        const { title, description, due_date, priority, assigned_to } = req.body;
        const created_by = req.session.user.id;

        // Validation
        if (!title || !description || !due_date || !priority || !assigned_to) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const taskData = {
            title,
            description,
            due_date,
            priority,
            assigned_to: parseInt(assigned_to),
            created_by
        };

        const newTask = await taskModel.createTask(taskData);
        
        req.session.success = 'Task created successfully';
        res.redirect('/admin/tasks');
    } catch (error) {
        console.error('Error creating task:', error);
        req.session.error = 'Error creating task';
        res.redirect('/admin/tasks/add');
    }
};

// Render edit task form
const renderEditTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await taskModel.getTaskById(taskId);
        const users = await userModel.getUsersForAssignment();

        if (!task) {
            req.session.error = 'Task not found';
            return res.redirect('/admin/tasks');
        }

        res.render('admin/editTask', {
            task,
            users,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error rendering edit task form:', error);
        res.status(500).render('error', { error: 'Internal server error' });
    }
};

// Update task
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, description, due_date, status, priority, assigned_to } = req.body;

        // Validation
        if (!title || !description || !due_date || !status || !priority || !assigned_to) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const taskData = {
            title,
            description,
            due_date,
            status,
            priority,
            assigned_to: parseInt(assigned_to)
        };

        await taskModel.updateTask(taskId, taskData);
        
        req.session.success = 'Task updated successfully';
        res.redirect('/admin/tasks');
    } catch (error) {
        console.error('Error updating task:', error);
        req.session.error = 'Error updating task';
        res.redirect(`/admin/tasks/edit/${req.params.id}`);
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const deleted = await taskModel.deleteTask(taskId);

        if (deleted) {
            req.session.success = 'Task deleted successfully';
        } else {
            req.session.error = 'Task not found';
        }

        res.redirect('/admin/tasks');
    } catch (error) {
        console.error('Error deleting task:', error);
        req.session.error = 'Error deleting task';
        res.redirect('/admin/tasks');
    }
};

// Update task status
const updateTaskStatus = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        await taskModel.updateTaskStatus(taskId, status);
        
        res.json({ success: true, message: 'Task status updated successfully' });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Error updating task status' });
    }
};

// Get task details with comments
const getTaskDetails = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await taskModel.getTaskById(taskId);
        const comments = await taskModel.getTaskComments(taskId);

        if (!task) {
            req.session.error = 'Task not found';
            return res.redirect('/admin/tasks');
        }

        res.render('admin/taskDetails', {
            task,
            comments,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error getting task details:', error);
        res.status(500).render('error', { error: 'Internal server error' });
    }
};

// Add comment to task
const addTaskComment = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { comment } = req.body;
        const userId = req.session.user.id;

        if (!comment) {
            return res.status(400).json({ error: 'Comment is required' });
        }

        await taskModel.addTaskComment(taskId, userId, comment);
        
        req.session.success = 'Comment added successfully';
        res.redirect(`/admin/tasks/${taskId}`);
    } catch (error) {
        console.error('Error adding comment:', error);
        req.session.error = 'Error adding comment';
        res.redirect(`/admin/tasks/${req.params.id}`);
    }
};

// Get tasks by status
const getTasksByStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const tasks = await taskModel.getTasksByStatus(status);
        const stats = await taskModel.getTaskStatistics();

        res.render('admin/taskDashboard', {
            tasks,
            stats,
            currentStatus: status,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error getting tasks by status:', error);
        res.status(500).render('error', { error: 'Internal server error' });
    }
};

// Get overdue tasks
const getOverdueTasks = async (req, res) => {
    try {
        const tasks = await taskModel.getOverdueTasks();
        const stats = await taskModel.getTaskStatistics();

        res.render('admin/taskDashboard', {
            tasks,
            stats,
            showOverdue: true,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error getting overdue tasks:', error);
        res.status(500).render('error', { error: 'Internal server error' });
    }
};

// User dashboard
const renderUserDashboard = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const tasks = await taskModel.getTasksByUser(userId);
        const stats = await taskModel.getTaskStatistics();

        res.render('user/dashboard', {
            tasks,
            stats,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error rendering user dashboard:', error);
        res.status(500).render('error', { error: 'Internal server error' });
    }
};

// User task dashboard
const renderUserTaskDashboard = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const tasks = await taskModel.getTasksByUser(userId);
        const stats = await taskModel.getTaskStatistics();

        res.render('user/taskDashboard', {
            tasks,
            stats,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error rendering user task dashboard:', error);
        res.status(500).render('error', { error: 'Internal server error' });
    }
};

// User task details
const renderUserTaskDetails = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.session.user.id;
        const task = await taskModel.getTaskById(taskId);
        const comments = await taskModel.getTaskComments(taskId);

        if (!task) {
            req.session.error = 'Task not found';
            return res.redirect('/user/tasks');
        }

        // Check if user is assigned to this task
        if (task.assigned_to !== userId && req.session.user.role !== 'admin') {
            req.session.error = 'Access denied';
            return res.redirect('/user/tasks');
        }

        res.render('user/taskDetails', {
            task,
            comments,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error getting user task details:', error);
        res.status(500).render('error', { error: 'Internal server error' });
    }
};

// User update task status
const userUpdateTaskStatus = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.session.user.id;
        const { status } = req.body;

        // Verify user owns the task
        const task = await taskModel.getTaskById(taskId);
        if (!task || task.assigned_to !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await taskModel.updateTaskStatus(taskId, status);
        
        res.json({ success: true, message: 'Task status updated successfully' });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Error updating task status' });
    }
};

module.exports = {
    renderTaskDashboard,
    renderAddTask,
    createTask,
    renderEditTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTaskDetails,
    addTaskComment,
    getTasksByStatus,
    getOverdueTasks,
    renderUserDashboard,
    renderUserTaskDashboard,
    renderUserTaskDetails,
    userUpdateTaskStatus
}; 