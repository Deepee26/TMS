# Manual Render Setup (Avoiding Duplicate Keys Error)

## 🚨 Problem: "Duplicate keys are not allowed"

This error occurs when trying to set environment variables that are already defined. Here's how to fix it:

## 🔧 Solution: Manual Environment Variable Setup

### Step 1: Create PostgreSQL Database First

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +"** → **"PostgreSQL"**
3. **Configure**:
   - **Name**: `task-management-db`
   - **Database**: `task_management_db`
   - **User**: `task_management_user`
   - **Plan**: Free
4. **Click "Create Database"**

### Step 2: Get Database Connection Details

1. **Click on your database**
2. **Go to "Connections" tab**
3. **Copy these values**:
   - **Host**: `dpg-xxxxx-a.oregon-postgres.render.com`
   - **Database**: `task_management_db`
   - **User**: `task_management_user`
   - **Password**: `your-generated-password`
   - **Port**: `5432`

### Step 3: Create Web Service

1. **Click "New +"** → **"Web Service"**
2. **Connect your GitHub repository**
3. **Configure**:
   - **Name**: `task-management-system`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Click "Create Web Service"**

### Step 4: Set Environment Variables Manually

**Important**: Don't use the "Link Database" feature to avoid duplicate keys.

1. **Go to your web service**
2. **Click "Environment" tab**
3. **Add these variables one by one**:

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

**Replace the values**:
- `dpg-xxxxx-a.oregon-postgres.render.com` with your actual database host
- `your-generated-password` with your actual database password
- `your-app-name.onrender.com` with your actual app URL
- `your-email@gmail.com` and `your-gmail-app-password` with your email credentials

### Step 5: Deploy

1. **Click "Save Changes"** after setting environment variables
2. **Go to "Manual Deploy" tab**
3. **Click "Deploy latest commit"**
4. **Watch the build logs**

## 🔍 Verification

Look for these in your deployment logs:
```
✅ Database connection successful
✅ Tables created successfully
✅ Admin user created
```

## 🚨 Avoiding Duplicate Keys

### Don't Do This:
- ❌ Use "Link Database" feature (creates duplicate variables)
- ❌ Set the same variable twice
- ❌ Use render.yaml with database linking

### Do This Instead:
- ✅ Set environment variables manually
- ✅ Create database first, then web service
- ✅ Use simplified render.yaml (without database linking)

## 📝 Example Environment Variables

Here's exactly what to set in Render dashboard:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `SESSION_SECRET` | `my-super-secret-session-key-12345` |
| `JWT_SECRET` | `my-super-secret-jwt-key-67890` |
| `BASE_URL` | `https://your-app-name.onrender.com` |
| `DB_HOST` | `dpg-abc123def456-a.oregon-postgres.render.com` |
| `DB_NAME` | `task_management_db` |
| `DB_USER` | `task_management_user` |
| `DB_PASS` | `abc123def456ghi789jkl012mno345pqr678stu901vwx234yz` |
| `EMAIL_USER` | `your-email@gmail.com` |
| `EMAIL_PASS` | `your-gmail-app-password` |

## 🔧 Troubleshooting

### Still Getting Duplicate Keys Error?
1. **Check if variables already exist** in Environment tab
2. **Delete any existing variables** before adding new ones
3. **Don't use "Link Database"** feature
4. **Set variables manually** one by one

### Database Connection Still Failing?
1. **Verify database is created** and running
2. **Check environment variables** are set correctly
3. **Ensure no typos** in variable names or values
4. **Redeploy** after setting variables 