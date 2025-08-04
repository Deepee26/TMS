const db = require('../config/db');
const bcrypt = require('bcrypt');

// Create users table
const createUserTable = async () => {
    try {
        await db.none(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
                is_verified BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created successfully');
        
        // Create admin user
        await createAdminUser();
    } catch (error) {
        console.error('Error creating users table:', error);
    }
};

// Create admin user
const createAdminUser = async () => {
    try {
        const adminEmail = 'sdendup2017@gmail.com';
        const adminPassword = 'admin123';
        
        // Check if admin already exists
        const existingAdmin = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [adminEmail]);
        
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await db.none(`
                INSERT INTO users (email, password, first_name, last_name, role)
                VALUES ($1, $2, $3, $4, $5)
            `, [adminEmail, hashedPassword, 'Admin', 'User', 'admin']);
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

// Create a new user
const createUser = async (userData) => {
    try {
        const { email, password, first_name, last_name, role = 'user' } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await db.one(`
            INSERT INTO users (email, password, first_name, last_name, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, first_name, last_name, role, created_at
        `, [email, hashedPassword, first_name, last_name, role]);
        
        return result;
    } catch (error) {
        throw error;
    }
};

// Find user by email
const findUserByEmail = async (email) => {
    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
        return user;
    } catch (error) {
        throw error;
    }
};

// Find user by ID
const findUserById = async (id) => {
    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
        return user;
    } catch (error) {
        throw error;
    }
};

// Get all users (for admin)
const getAllUsers = async () => {
    try {
        const users = await db.any(`
            SELECT id, email, first_name, last_name, role, is_verified, created_at
            FROM users
            ORDER BY created_at DESC
        `);
        return users;
    } catch (error) {
        throw error;
    }
};

// Update user
const updateUser = async (userId, userData) => {
    try {
        const { first_name, last_name, role, is_verified } = userData;
        const result = await db.one(`
            UPDATE users 
            SET first_name = $1, last_name = $2, role = $3, is_verified = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING id, email, first_name, last_name, role, is_verified
        `, [first_name, last_name, role, is_verified, userId]);
        return result;
    } catch (error) {
        throw error;
    }
};

// Toggle user verification status
const toggleUserVerification = async (userId) => {
    try {
        const user = await findUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        const newStatus = !user.is_verified;
        const result = await db.one(`
            UPDATE users 
            SET is_verified = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id, email, first_name, last_name, role, is_verified
        `, [newStatus, userId]);
        return result;
    } catch (error) {
        throw error;
    }
};

// Delete user
const deleteUser = async (userId) => {
    try {
        const result = await db.result('DELETE FROM users WHERE id = $1', [userId]);
        return result.rowCount > 0;
    } catch (error) {
        throw error;
    }
};

// Get users for task assignment
const getUsersForAssignment = async () => {
    try {
        const users = await db.any(`
            SELECT id, first_name, last_name, email
            FROM users
            WHERE is_verified = true AND role = 'user'
            ORDER BY first_name, last_name
        `);
        return users;
    } catch (error) {
        throw error;
    }
};

// Verify password
const verifyPassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw error;
    }
};

// Update user password
const updateUserPassword = async (userId, newPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await db.one(`
            UPDATE users 
            SET password = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id, email, first_name, last_name, role, is_verified
        `, [hashedPassword, userId]);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createUserTable,
    createAdminUser,
    createUser,
    findUserByEmail,
    findUserById,
    getAllUsers,
    updateUser,
    toggleUserVerification,
    deleteUser,
    getUsersForAssignment,
    verifyPassword,
    updateUserPassword
};
