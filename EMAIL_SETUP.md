# Email Configuration Setup

## Overview
The Task Management System includes email functionality for password reset features. However, email credentials are not configured by default to avoid security issues.

## Current Status
- ✅ **Email Error Handling**: The system gracefully handles missing email credentials
- ✅ **User-Friendly Messages**: Users see clear messages when email service is not configured
- ✅ **No System Crashes**: Missing email credentials don't break the application

## Email Features
- **Password Reset**: Users can request password reset links via email
- **Email Verification**: (Currently disabled for simplicity)

## Configuration (Optional)

### 1. Gmail Setup
To enable email functionality, add the following to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
JWT_SECRET=your-jwt-secret-key
BASE_URL=http://localhost:3000
```

### 2. Gmail App Password
For Gmail, you need to use an "App Password" instead of your regular password:

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account Settings > Security
3. Generate an "App Password" for "Mail"
4. Use this 16-character password as `EMAIL_PASS`

### 3. Alternative Email Providers
You can modify the email configuration in `controllers/authController.js`:

```javascript
// For other providers (e.g., Outlook, Yahoo)
const transporter = nodemailer.createTransport({
    service: 'outlook', // or 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// For custom SMTP servers
const transporter = nodemailer.createTransport({
    host: 'smtp.your-provider.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
```

## Current Behavior
- **Without Email Configuration**: Users see "Email service is not configured" message
- **With Email Configuration**: Users receive password reset links via email
- **Error Handling**: All email errors are caught and displayed user-friendly messages

## Security Notes
- Never commit email credentials to version control
- Use environment variables for all sensitive data
- App passwords are recommended over regular passwords
- JWT tokens expire after 1 hour for security

## Testing
To test email functionality:
1. Configure email credentials in `.env`
2. Restart the server
3. Use the "Forgot Password" feature
4. Check your email for reset links

## Troubleshooting
- **"Missing credentials" error**: Email credentials not configured
- **"EAUTH" error**: Invalid email credentials
- **No emails received**: Check spam folder and email configuration
- **Server crashes**: Email errors are now handled gracefully 