const express = require('express');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { createUserTable } = require('./models/userModel');
const { createTaskTable, createTaskTables } = require('./models/taskModel');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.session.success;
    res.locals.error = req.session.error;
    delete req.session.success;
    delete req.session.error;
    next();
});

// Setting up view engine as ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Route imports
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Routes
app.use('/', authRoutes);
app.use('/', taskRoutes);

// Landing page
app.get('/', (req, res) => {
    res.render('pages/landing');
});

// Create database tables
const initializeDatabase = async () => {
    try {
        console.log('Starting database initialization...');
        console.log('Environment variables:');
        console.log('DB_HOST:', process.env.DB_HOST);
        console.log('DB_NAME:', process.env.DB_NAME);
        console.log('DB_USER:', process.env.DB_USER);
        console.log('DB_PASS:', process.env.DB_PASS ? '[SET]' : '[NOT SET]');
        
        console.log('Creating user table...');
        await createUserTable();
        console.log('User table created successfully');
        
        console.log('Creating task table...');
        await createTaskTable();
        console.log('Task table created successfully');
        
        console.log('Creating task-related tables...');
        await createTaskTables();
        console.log('Task-related tables created successfully');
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        console.error('Error stack:', error.stack);
        throw error; // Re-throw to prevent server from starting with DB errors
    }
};

// Initialize database and start server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Task Management System is running on http://localhost:${PORT}`);
        console.log(`Admin login: sdendup2017@gmail.com / admin123`);
    });
}).catch((error) => {
    console.error('Failed to start server due to database initialization error:', error);
    process.exit(1);
});