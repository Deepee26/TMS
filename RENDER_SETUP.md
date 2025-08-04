# Render Deployment Fix - Database Connection Error

## 🚨 Problem: ECONNREFUSED 127.0.0.1:5432 in Render

Your application is trying to connect to localhost instead of Render's PostgreSQL database.

## 🔧 Solution Steps

### Step 1: Create PostgreSQL Database in Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `task-management-db`
   - **Database**: `task_management_db`
   - **User**: `task_management_user`
   - **Plan**: Free
4. Click "Create Database"

### Step 2: Get Database Connection Details

1. Click on your newly created database
2. Go to "Connections" tab
3. Copy these values:
   - **Host**: `dpg-xxxxx-a.oregon-postgres.render.com`
   - **Database**: `task_management_db`
   - **User**: `task_management_user`
   - **Password**: `your-generated-password`
   - **Port**: `5432`

### Step 3: Configure Web Service Environment Variables

1. Go to your web service in Render
2. Click "Environment" tab
3. Add these environment variables:

```
NODE_ENV=production
PORT=10000
SESSION_SECRET=your-random-secret-string-here
JWT_SECRET=your-random-jwt-secret-here
BASE_URL=https://your-app-name.onrender.com
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_NAME=task_management_db
DB_USER=task_management_user
DB_PASS=your-generated-password
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### Step 4: Link Database to Web Service (Alternative)

Instead of manually setting DB variables:

1. In your web service settings
2. Go to "Environment" tab
3. Click "Link Database"
4. Select your PostgreSQL database
5. Render will automatically add the connection variables

### Step 5: Redeploy

1. Go to your web service
2. Click "Manual Deploy" → "Deploy latest commit"
3. Watch the build logs for any errors

## 🔍 Verification Steps

### Check Environment Variables in Render

1. Go to your web service → Environment tab
2. Verify these variables exist:
   - `DB_HOST` (should NOT be localhost)
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASS`

### Check Build Logs

Look for these in your deployment logs:
```
✅ Database connection successful
✅ Tables created successfully
✅ Admin user created
```

## 🚨 Common Issues & Fixes

### Issue 1: Still connecting to localhost
**Fix**: Make sure `DB_HOST` is set to Render's database host, not localhost

### Issue 2: SSL connection errors
**Fix**: The SSL configuration in `config/db.js` should handle this automatically

### Issue 3: Database doesn't exist
**Fix**: Create the database first, then deploy the web service

### Issue 4: Permission denied
**Fix**: Make sure the database user has proper permissions

## 📝 Example Environment Variables

Here's what your environment variables should look like in Render:

```
NODE_ENV=production
PORT=10000
SESSION_SECRET=my-super-secret-session-key-12345
JWT_SECRET=my-super-secret-jwt-key-67890
BASE_URL=https://task-management-system.onrender.com
DB_HOST=dpg-abc123def456-a.oregon-postgres.render.com
DB_NAME=task_management_db
DB_USER=task_management_user
DB_PASS=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

## 🔧 Alternative: Use render.yaml (Recommended)

If you want to use the `render.yaml` file:

1. Make sure your `render.yaml` is in your repository
2. In Render dashboard, click "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically create both services with proper linking

## 📞 Support

If you're still having issues:
1. Check the deployment logs in Render
2. Verify all environment variables are set
3. Make sure the database is created and running
4. Ensure the database user has proper permissions 