// lib/email.ts
import * as brevo from '@getbrevo/brevo'

// Initialize Brevo API
const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
)

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

  const sendSmtpEmail = new brevo.SendSmtpEmail()
  
  sendSmtpEmail.sender = { 
    name: 'C3 Initiative', 
    email: process.env.BREVO_SENDER_EMAIL || 'noreply@yourdomain.com'
  }
  sendSmtpEmail.to = [{ email, name }]
  sendSmtpEmail.subject = 'Verify Your Email - C3 Initiative'
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #f97316 0%, #3b82f6 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            color: #333;
            font-size: 22px;
            margin-top: 0;
          }
          .content p {
            color: #666;
            margin: 15px 0;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #f97316 0%, #3b82f6 100%);
            color: white !important;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            font-size: 16px;
          }
          .link-text {
            word-break: break-all;
            color: #3b82f6;
            font-size: 14px;
            padding: 15px;
            background: #f0f9ff;
            border-radius: 5px;
            margin: 20px 0;
          }
          .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Welcome to C3 Initiative!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for signing up for the C3 Initiative! We're excited to have you join our cervical cancer education community.</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            
            <div class="button-container">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <div class="link-text">${verificationUrl}</div>
            
            <div class="warning">
              <strong>⏰ Important:</strong> This verification link will expire in 24 hours.
            </div>
            
            <p>If you didn't create an account with C3 Initiative, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} C3 Initiative. All rights reserved.</p>
            <p>Empowering communities through cervical cancer education.</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('[Email] Verification email sent via Brevo:', data.body.messageId)
    return { success: true, messageId: data.body.messageId }
  } catch (error) {
    console.error('[Email] Brevo error:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/learn/cervical-cancer`

  const sendSmtpEmail = new brevo.SendSmtpEmail()
  
  sendSmtpEmail.sender = { 
    name: 'C3 Initiative', 
    email: process.env.BREVO_SENDER_EMAIL || 'noreply@yourdomain.com'
  }
  sendSmtpEmail.to = [{ email, name }]
  sendSmtpEmail.subject = 'Welcome to C3 Initiative! 🎉'
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
          }
          .success-icon {
            text-align: center;
            font-size: 60px;
            margin: 20px 0;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #f97316 0%, #3b82f6 100%);
            color: white !important;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            font-size: 16px;
          }
          .features {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .features ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .features li {
            margin: 8px 0;
          }
          .footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verified Successfully!</h1>
          </div>
          <div class="content">
            <div class="success-icon">✅</div>
            <h2 style="text-align: center; color: #10b981;">Welcome, ${name}!</h2>
            <p style="text-align: center;">Your email has been verified and your account is now active.</p>
            
            <div class="features">
              <h3 style="margin-top: 0; color: #3b82f6;">What's Next?</h3>
              <ul>
                <li>📚 Access 6 comprehensive learning modules</li>
                <li>🎯 Complete interactive quizzes and assessments</li>
                <li>🏆 Earn your certificate upon completion</li>
                <li>💡 Learn about prevention, detection, and treatment</li>
              </ul>
            </div>
            
            <div class="button-container">
              <a href="${dashboardUrl}" class="button">Start Learning Now</a>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 14px;">
              If you have any questions, feel free to reach out to our support team.
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} C3 Initiative. All rights reserved.</p>
            <p>Empowering communities through cervical cancer education.</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('[Email] Welcome email sent via Brevo:', data.body.messageId)
    return { success: true, messageId: data.body.messageId }
  } catch (error) {
    console.error('[Email] Brevo error:', error)
    return { success: false, error }
  }
}