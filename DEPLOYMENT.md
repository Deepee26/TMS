# Deployment Guide for Render

## Prerequisites
- A GitHub account with your code pushed to a repository
- A Render account (free tier available)

## Step 1: Prepare Your Repository

### 1.1 Update .gitignore
Make sure your `.gitignore` file includes:
```
node_modules/
.env
```

### 1.2 Commit and Push Your Changes
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Deploy on Render

### 2.1 Create a New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your Task Management System

### 2.2 Configure the Web Service
- **Name**: `task-management-system` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2.3 Environment Variables
Add these environment variables in Render dashboard:

#### Database Variables (Auto-configured if using render.yaml)
- `DB_HOST` - Will be auto-filled from database service
- `DB_NAME` - Will be auto-filled from database service  
- `DB_USER` - Will be auto-filled from database service
- `DB_PASS` - Will be auto-filled from database service

#### Application Variables
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render's default)
- `SESSION_SECRET`: Generate a random string
- `JWT_SECRET`: Generate a random string
- `BASE_URL`: `https://your-app-name.onrender.com` (replace with your actual URL)

#### Email Variables (Optional)
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Your Gmail app password

### 2.4 Create PostgreSQL Database
1. In Render dashboard, click "New +" and select "PostgreSQL"
2. Name: `task-management-db`
3. Database: `task_management_db`
4. User: `task_management_user`
5. Plan: Free

### 2.5 Link Database to Web Service
1. Go to your web service settings
2. Add the database as an environment variable
3. Render will automatically provide the connection details

## Step 3: Deploy Using render.yaml (Alternative)

If you prefer using the `render.yaml` file:

1. Push your code with the `render.yaml` file
2. In Render dashboard, click "New +" and select "Blueprint"
3. Connect your repository
4. Render will automatically create both the web service and database

## Step 4: Post-Deployment

### 4.1 Verify Deployment
1. Check the deployment logs for any errors
2. Visit your app URL to ensure it's working
3. Test the admin login: `sdendup2017@gmail.com` / `admin123`

### 4.2 Database Initialization
The application will automatically:
- Create all required tables
- Insert the default admin user
- Set up indexes and triggers

### 4.3 Custom Domain (Optional)
1. Go to your web service settings
2. Click "Custom Domains"
3. Add your domain and configure DNS

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check that all dependencies are in `package.json`
- Ensure `start` script is correct
- Verify Node.js version compatibility

#### 2. Database Connection Errors
- Verify database environment variables are set
- Check that database service is running
- Ensure SSL is properly configured

#### 3. Email Not Working
- Verify email credentials are correct
- Check that Gmail app password is used (not regular password)
- Ensure 2FA is enabled on Gmail account

#### 4. Application Crashes
- Check application logs in Render dashboard
- Verify all environment variables are set
- Test locally with production environment variables

### Useful Commands
```bash
# Check deployment status
curl -I https://your-app-name.onrender.com

# View logs
# Use Render dashboard > Your Service > Logs
```

## Security Notes

1. **Environment Variables**: Never commit sensitive data to your repository
2. **Database**: Use Render's managed PostgreSQL for production
3. **SSL**: Render provides automatic SSL certificates
4. **Secrets**: Use Render's secret management for sensitive data

## Cost Optimization

- **Free Tier**: Includes 750 hours/month for web services
- **Database**: Free tier includes 1GB storage
- **Custom Domains**: Free with SSL certificates
- **Auto-sleep**: Free services sleep after 15 minutes of inactivity

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app) 