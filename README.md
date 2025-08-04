# Task Management System

A comprehensive web application designed to streamline task assignment and tracking within an organization. Built using the MVC architecture, the system leverages Node.js for backend functionality, EJS for dynamic view rendering, and PostgreSQL for robust data storage.

## Features

### 🎯 Core Functionality
- **Task Assignment**: Easily assign tasks to team members with clear descriptions and deadlines
- **Progress Tracking**: Monitor task progress with real-time status updates and completion tracking
- **Deadline Management**: Set priorities and manage deadlines to ensure timely task completion
- **User Management**: Comprehensive user registration and role-based access control
- **Real-time Updates**: Dynamic status changes and progress monitoring

### 👥 User Roles
- **Admin Users**: Full system access with task creation, editing, deletion, and user management
- **Regular Users**: View assigned tasks, update status, and track progress

### 📊 Dashboard Features
- **Statistics Overview**: Total tasks, completed, pending, and overdue counts
- **Filter Options**: Filter tasks by status (All, Pending, In Progress, Completed, Overdue)
- **Priority Management**: Four priority levels (Low, Medium, High, Urgent)
- **Status Tracking**: Five status types (Pending, In Progress, Completed, Cancelled)

## Technology Stack

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **PostgreSQL**: Robust relational database
- **bcrypt**: Password hashing and security
- **express-session**: Session management
- **nodemailer**: Email functionality

### Frontend
- **EJS**: Embedded JavaScript templating
- **Bootstrap 5**: Modern responsive UI framework
- **Font Awesome**: Icon library
- **Custom CSS**: Enhanced styling and animations

### Database
- **PostgreSQL**: Primary database
- **pg-promise**: Database connection and query handling

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_NAME=task_management_db
DB_USER=your_username
DB_PASS=your_password

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Configuration
SESSION_SECRET=your_session_secret_key

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
BASE_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
```

### 4. Database Setup
1. Create a PostgreSQL database:
```sql
CREATE DATABASE task_management_db;
```

2. Run the schema file:
```bash
psql -d task_management_db -f schema.sql
```

Or the tables will be created automatically when you start the application.

### 5. Start the Application
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Default Admin Account

The system creates a default admin account automatically:
- **Email**: sdendup2017@gmail.com
- **Password**: admin123

## API Endpoints

### Authentication
- `GET /` - Landing page
- `GET /login` - Login page
- `POST /login` - Login authentication
- `GET /signup` - Registration page
- `POST /signup` - User registration
- `GET /logout` - User logout

### Admin Routes
- `GET /admin/tasks` - Task dashboard
- `GET /admin/tasks/add` - Add task form
- `POST /admin/tasks/add` - Create new task
- `GET /admin/tasks/edit/:id` - Edit task form
- `POST /admin/tasks/edit/:id` - Update task
- `POST /admin/tasks/delete/:id` - Delete task
- `GET /admin/tasks/:id` - Task details
- `GET /admin/tasks/status/:status` - Filter tasks by status
- `GET /admin/tasks/overdue` - View overdue tasks

### User Routes
- `GET /user/tasks` - User task dashboard
- `GET /user/tasks/:id` - Task details
- `POST /user/tasks/:id/status` - Update task status

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to INTEGER REFERENCES users(id),
    assigned_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Task Comments Table
```sql
CREATE TABLE task_comments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Features in Detail

### Task Management
- **Create Tasks**: Admins can create tasks with title, description, due date, priority, and assignment
- **Edit Tasks**: Full editing capabilities for all task properties
- **Delete Tasks**: Remove tasks with confirmation
- **Status Updates**: Real-time status changes (Pending → In Progress → Completed)
- **Priority Levels**: Low, Medium, High, Urgent with color coding
- **Due Date Tracking**: Automatic overdue detection and highlighting

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with Bootstrap 5
- **Real-time Updates**: Dynamic content updates without page refresh
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Accessibility**: WCAG compliant with proper ARIA labels

### Security Features
- **Password Hashing**: bcrypt encryption for secure password storage
- **Session Management**: Secure session handling with express-session
- **Role-based Access**: Different permissions for admin and regular users
- **Input Validation**: Server-side and client-side validation
- **SQL Injection Protection**: Parameterized queries with pg-promise

### Performance Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Session-based caching for frequently accessed data
- **Lazy Loading**: Efficient data loading and pagination
- **Minified Assets**: Optimized CSS and JavaScript delivery

## Development

### Project Structure
```
task-management-system/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── taskController.js      # Task management logic
│   └── userController.js      # User management logic
├── models/
│   ├── taskModel.js          # Task data operations
│   └── userModel.js          # User data operations
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── taskRoutes.js         # Task management routes
│   └── userRoutes.js         # User management routes
├── views/
│   ├── admin/                # Admin interface views
│   ├── user/                 # User interface views
│   ├── pages/                # Public pages
│   └── partials/             # Reusable view components
├── public/
│   ├── css/                  # Stylesheets
│   ├── js/                   # Client-side JavaScript
│   └── img/                  # Images and assets
├── schema.sql                # Database schema
├── server.js                 # Application entry point
└── package.json              # Dependencies and scripts
```

### Running in Development Mode
```bash
npm run dev
```

### Database Migrations
The application automatically creates all necessary tables on startup. For manual database operations:

```bash
# Connect to PostgreSQL
psql -U your_username -d task_management_db

# Run schema
\i schema.sql
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## Changelog

### Version 1.0.0
- Initial release
- Complete task management functionality
- User authentication and authorization
- Admin and user dashboards
- Responsive design implementation
- Database schema and migrations
- Security features and optimizations

---

**Built with ❤️ using Node.js, Express, EJS, and PostgreSQL**