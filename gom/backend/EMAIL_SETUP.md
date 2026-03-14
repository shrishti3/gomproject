# Email Configuration Guide

This guide explains how to set up email notifications for contact form submissions.

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com
2. Click "Security" in the left sidebar
3. Scroll to "2-Step Verification" and enable it
4. Follow the prompts to verify your phone

### Step 2: Create an App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" from the "Select app" dropdown
3. Select "Windows Computer" from the "Select device" dropdown
4. Google will display a 16-character password
5. **Copy this password** - you'll use it in the `.env` file

### Step 3: Update Backend Configuration

In your backend `.env` file, update:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
RECIPIENT_EMAIL=gom123@gmail.com
```

Replace `your-email@gmail.com` with your actual Gmail address.

### Step 4: Test the Setup

When someone submits the contact form:
1. The form data is saved to MongoDB
2. An email is automatically sent to `gom123@gmail.com`
3. The response will indicate if the email was sent successfully

## Email Template

The contact form email includes:
- Full Name
- Email Address
- Phone Number
- Company Name
- Service Type (ODM, SCM, EMS, Wire Harnessing)
- Message Content
- Budget Range
- Timeline
- Submission Timestamp
- Reply-To address set to the submitter's email

## Troubleshooting

### Email Not Sending
- ✓ Verify 2-Factor Authentication is enabled
- ✓ Check that you're using the App Password, not your Gmail password
- ✓ Confirm `SMTP_USER` matches your Gmail address
- ✓ Check backend logs for error messages

### "Invalid login" Error
- The App Password is incorrect or expired
- Regenerate a new App Password and update `.env`

### Gmail App Password Expires
- Google may invalidate app passwords
- Generate a new one and update `.env`

## Security Notes

⚠️ **Never commit `.env` file to Git**
- Add `.env` to `.gitignore` (already done)
- Always use App Passwords, never your actual Gmail password
- Rotate App Passwords periodically for security

## Alternative Email Providers

If you prefer not to use Gmail, you can configure other SMTP providers:

### Office 365/Outlook
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### SendGrid
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

Contact the email provider for their SMTP credentials.
