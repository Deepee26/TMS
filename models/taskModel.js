const db = require('../config/db');
const bcrypt = require('bcrypt');

// Create tasks table
const createTaskTable = async () => {
    try {
        await db.none(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                due_date DATE NOT NULL,
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
                priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
                assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
                created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tasks table created successfully');
    } catch (error) {
        console.error('Error creating tasks table:', error);
    }
};

// Create all task-related tables
const createTaskTables = async () => {
    try {
        // Create task_comments table
        await db.none(`
            CREATE TABLE IF NOT EXISTS task_comments (
                id SERIAL PRIMARY KEY,
                task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                comment TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create task_attachments table
        await db.none(`
            CREATE TABLE IF NOT EXISTS task_attachments (
                id SERIAL PRIMARY KEY,
                task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
                filename VARCHAR(255) NOT NULL,
                file_path VARCHAR(500) NOT NULL,
                file_size INTEGER,
                uploaded_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create indexes
        await db.none('CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to)');
        await db.none('CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)');
        await db.none('CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date)');
        await db.none('CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id)');
        await db.none('CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON task_attachments(task_id)');

        console.log('All task-related tables created successfully');
    } catch (error) {
        console.error('Error creating task tables:', error);
    }
};

// Create a new task
const createTask = async (taskData) => {
    try {
        const { title, description, due_date, priority, assigned_to, created_by } = taskData;
        const result = await db.one(`
            INSERT INTO tasks (title, description, due_date, priority, assigned_to, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [title, description, due_date, priority, assigned_to, created_by]);
        return result;
    } catch (error) {
        throw error;
    }
};

// Get all tasks with user information
const getAllTasks = async () => {
    try {
        const tasks = await db.any(`
            SELECT t.*, 
                   u1.first_name as assigned_to_name, 
                   u1.last_name as assigned_to_last_name,
                   u2.first_name as created_by_name, 
                   u2.last_name as created_by_last_name
            FROM tasks t
            LEFT JOIN users u1 ON t.assigned_to = u1.id
            LEFT JOIN users u2 ON t.created_by = u2.id
            ORDER BY t.created_at DESC
        `);
        return tasks;
    } catch (error) {
        throw error;
    }
};

// Get tasks assigned to a specific user
const getTasksByUser = async (userId) => {
    try {
        const tasks = await db.any(`
            SELECT t.*, 
                   u1.first_name as assigned_to_name, 
                   u1.last_name as assigned_to_last_name,
                   u2.first_name as created_by_name, 
                   u2.last_name as created_by_last_name
            FROM tasks t
            LEFT JOIN users u1 ON t.assigned_to = u1.id
            LEFT JOIN users u2 ON t.created_by = u2.id
            WHERE t.assigned_to = $1
            ORDER BY t.due_date ASC, t.priority DESC
        `, [userId]);
        return tasks;
    } catch (error) {
        throw error;
    }
};

// Get a single task by ID
const getTaskById = async (taskId) => {
    try {
        const task = await db.one(`
            SELECT t.*, 
                   u1.first_name as assigned_to_name, 
                   u1.last_name as assigned_to_last_name,
                   u2.first_name as created_by_name, 
                   u2.last_name as created_by_last_name
            FROM tasks t
            LEFT JOIN users u1 ON t.assigned_to = u1.id
            LEFT JOIN users u2 ON t.created_by = u2.id
            WHERE t.id = $1
        `, [taskId]);
        return task;
    } catch (error) {
        throw error;
    }
};

// Update a task
const updateTask = async (taskId, taskData) => {
    try {
        const { title, description, due_date, status, priority, assigned_to } = taskData;
        const result = await db.one(`
            UPDATE tasks 
            SET title = $1, description = $2, due_date = $3, status = $4, priority = $5, assigned_to = $6, updated_at = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING *
        `, [title, description, due_date, status, priority, assigned_to, taskId]);
        return result;
    } catch (error) {
        throw error;
    }
};

// Delete a task
const deleteTask = async (taskId) => {
    try {
        const result = await db.result('DELETE FROM tasks WHERE id = $1', [taskId]);
        return result.rowCount > 0;
    } catch (error) {
        throw error;
    }
};

// Update task status
const updateTaskStatus = async (taskId, status) => {
    try {
        const result = await db.one(`
            UPDATE tasks 
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `, [status, taskId]);
        return result;
    } catch (error) {
        throw error;
    }
};

// Get tasks by status
const getTasksByStatus = async (status) => {
    try {
        const tasks = await db.any(`
            SELECT t.*, 
                   u1.first_name as assigned_to_name, 
                   u1.last_name as assigned_to_last_name,
                   u2.first_name as created_by_name, 
                   u2.last_name as created_by_last_name
            FROM tasks t
            LEFT JOIN users u1 ON t.assigned_to = u1.id
            LEFT JOIN users u2 ON t.created_by = u2.id
            WHERE t.status = $1
            ORDER BY t.due_date ASC
        `, [status]);
        return tasks;
    } catch (error) {
        throw error;
    }
};

// Get overdue tasks
const getOverdueTasks = async () => {
    try {
        const tasks = await db.any(`
            SELECT t.*, 
                   u1.first_name as assigned_to_name, 
                   u1.last_name as assigned_to_last_name,
                   u2.first_name as created_by_name, 
                   u2.last_name as created_by_last_name
            FROM tasks t
            LEFT JOIN users u1 ON t.assigned_to = u1.id
            LEFT JOIN users u2 ON t.created_by = u2.id
            WHERE t.due_date < CURRENT_DATE AND t.status NOT IN ('completed', 'cancelled')
            ORDER BY t.due_date ASC
        `);
        return tasks;
    } catch (error) {
        throw error;
    }
};

// Get task statistics
const getTaskStatistics = async () => {
    try {
        const stats = await db.one(`
            SELECT 
                COUNT(*) as total_tasks,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
                COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_tasks,
                COUNT(CASE WHEN due_date < CURRENT_DATE AND status NOT IN ('completed', 'cancelled') THEN 1 END) as overdue_tasks
            FROM tasks
        `);
        return stats;
    } catch (error) {
        throw error;
    }
};

// Add comment to task
const addTaskComment = async (taskId, userId, comment) => {
    try {
        const result = await db.one(`
            INSERT INTO task_comments (task_id, user_id, comment)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [taskId, userId, comment]);
        return result;
    } catch (error) {
        throw error;
    }
};

// Get task comments
const getTaskComments = async (taskId) => {
    try {
        const comments = await db.any(`
            SELECT tc.*, u.first_name, u.last_name
            FROM task_comments tc
            JOIN users u ON tc.user_id = u.id
            WHERE tc.task_id = $1
            ORDER BY tc.created_at ASC
        `, [taskId]);
        return comments;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createTaskTable,
    createTaskTables,
    createTask,
    getAllTasks,
    getTasksByUser,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksByStatus,
    getOverdueTasks,
    getTaskStatistics,
    addTaskComment,
    getTaskComments
}; 