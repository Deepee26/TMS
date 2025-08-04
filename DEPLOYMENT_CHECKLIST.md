# Deployment Checklist for Render

## ✅ Pre-Deployment Checklist

### Code Preparation
- [ ] `package.json` has correct `start` script (`node server.js`)
- [ ] `.gitignore` includes `node_modules/` and `.env`
- [ ] All dependencies are listed in `package.json`
- [ ] No hardcoded database credentials in code
- [ ] SSL configuration is production-ready

### Files Created
- [ ] `render.yaml` - Service configuration
- [ ] `Procfile` - Alternative deployment method
- [ ] `DEPLOYMENT.md` - Detailed deployment guide

### Environment Variables (to set in Render)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `SESSION_SECRET` = (random string)
- [ ] `JWT_SECRET` = (random string)
- [ ] `BASE_URL` = `https://your-app-name.onrender.com`
- [ ] `EMAIL_USER` = (your Gmail)
- [ ] `EMAIL_PASS` = (your Gmail app password)
- [ ] Database variables (auto-configured from database service)

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Render Account
- [ ] Sign up at [render.com](https://render.com)
- [ ] Connect GitHub account

### 3. Deploy Web Service
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Deploy

### 4. Create Database
- [ ] Create PostgreSQL database
- [ ] Link to web service
- [ ] Verify connection

### 5. Test Deployment
- [ ] Visit app URL
- [ ] Test admin login: `sdendup2017@gmail.com` / `admin123`
- [ ] Check all features work
- [ ] Verify email functionality (if configured)

## 🔧 Quick Commands

```bash
# Check if everything is committed
git status

# Push to GitHub
git push origin main

# Test locally with production env
NODE_ENV=production npm start
```

## 📝 Notes
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds
- Database is automatically initialized on first run
- All tables and admin user are created automatically 