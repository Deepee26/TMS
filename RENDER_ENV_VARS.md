# Environment Variables for Render Deployment

## 🚨 Important: .env File Does NOT Work on Render

The `.env` file is only for local development. For Render deployment, you must set environment variables in the Render dashboard.

## 📋 Required Environment Variables

### 1. Application Variables
```
NODE_ENV=production
PORT=10000
SESSION_SECRET=your-random-secret-string-here
JWT_SECRET=your-random-jwt-secret-here
BASE_URL=https://your-app-name.onrender.com
```

### 2. Database Variables (from Render PostgreSQL)
```
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_NAME=task_management_db
DB_USER=task_management_user
DB_PASS=your-generated-password
```

### 3. Email Variables (Optional)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

## 🔧 How to Set Environment Variables in Render

### Step 1: Go to Your Web Service
1. Open [Render Dashboard](https://dashboard.render.com/)
2. Click on your web service
3. Go to "Environment" tab

### Step 2: Add Variables
1. Click "Add Environment Variable"
2. Add each variable from the list above
3. Click "Save Changes"

### Step 3: Redeploy
1. Go to "Manual Deploy" tab
2. Click "Deploy latest commit"

## 🎯 Step-by-Step Setup

### 1. Create PostgreSQL Database
- Go to Render Dashboard
- Click "New +" → "PostgreSQL"
- Name: `task-management-db`
- Database: `task_management_db`
- User: `task_management_user`
- Plan: Free

### 2. Get Database Connection Details
- Click on your database
- Go to "Connections" tab
- Copy the connection details

### 3. Create Web Service
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Build Command: `npm install`
- Start Command: `npm start`

### 4. Set Environment Variables
Add these in your web service environment tab:

```
NODE_ENV=production
PORT=10000
SESSION_SECRET=my-super-secret-session-key-12345
JWT_SECRET=my-super-secret-jwt-key-67890
BASE_URL=https://your-app-name.onrender.com
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_NAME=task_management_db
DB_USER=task_management_user
DB_PASS=your-generated-password
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### 5. Deploy
- Click "Create Web Service"
- Watch the build logs
- Your app will be available at the provided URL

## 🔍 Verification

After deployment, check the logs for:
```
✅ Database connection successful
✅ Tables created successfully
✅ Admin user created
```

## 🚨 Common Issues

### Issue: Still getting ECONNREFUSED
**Solution**: Make sure `DB_HOST` is set to Render's database host, not localhost

### Issue: Environment variables not working
**Solution**: 
1. Check that variables are set in Render dashboard
2. Redeploy after setting variables
3. Verify variable names match exactly

### Issue: SSL connection errors
**Solution**: The SSL configuration in your code should handle this automatically

## 📞 Support

If you're still having issues:
1. Check the deployment logs in Render
2. Verify all environment variables are set correctly
3. Make sure the database is created and running
4. Ensure variable names match exactly (case-sensitive) 