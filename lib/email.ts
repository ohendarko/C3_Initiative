// lib/email.ts
import * as brevo from '@getbrevo/brevo'
import { EMAIL_SENDERS } from './email-config'

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
  
  // ✅ Use noreply for verification
  sendSmtpEmail.sender = EMAIL_SENDERS.NOREPLY
  
  sendSmtpEmail.to = [{ email, name }]
  sendSmtpEmail.subject = 'Verify Your Email - C3 Initiative'
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #3b82f6 100%); color: white !important; padding: 15px 40px; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to C3 Initiative!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for signing up! Please verify your email address to access your learning dashboard.</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3b82f6;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} C3 Initiative. All rights reserved.</p>
            <p style="color: #999; margin-top: 10px;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('[Brevo] ✅ Verification email sent via noreply@')
    return { success: true, messageId: data.body.messageId }
  } catch (error: any) {
    console.error('[Brevo] ❌ Failed to send verification email')
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/learn/cervical-cancer`

  const sendSmtpEmail = new brevo.SendSmtpEmail()
  
  // ✅ Use support for welcome (users might reply)
  sendSmtpEmail.sender = EMAIL_SENDERS.SUPPORT
  
  sendSmtpEmail.to = [{ email, name }]
  sendSmtpEmail.subject = 'Welcome to C3 Initiative! 🎉'
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #3b82f6 100%); color: white !important; padding: 15px 40px; text-decoration: none; border-radius: 5px; }
          .features { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verified Successfully!</h1>
          </div>
          <div class="content">
            <div style="text-align: center; font-size: 60px; margin: 20px 0;">✅</div>
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
            
            <div style="text-align: center;">
              <a href="${dashboardUrl}" class="button">Start Learning Now</a>
            </div>

            <p style="text-align: center; margin-top: 30px; color: #666;">
              Have questions? Reply to this email and we'll help you out!
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} C3 Initiative. All rights reserved.</p>
            <p style="color: #3b82f6; margin-top: 10px;">
              📧 Need help? Email us at support@c3-learning.com
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('[Brevo] ✅ Welcome email sent via support@')
    return { success: true, messageId: data.body.messageId }
  } catch (error: any) {
    console.error('[Brevo] ❌ Failed to send welcome email')
    return { success: false, error }
  }
}

// ✅ Add password reset email (use noreply)

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

  const sendSmtpEmail = new brevo.SendSmtpEmail()
  
  sendSmtpEmail.sender = EMAIL_SENDERS.NOREPLY  // Use noreply for security
  sendSmtpEmail.to = [{ email, name }]
  sendSmtpEmail.subject = 'Reset Your Password - C3 Initiative'
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #3b82f6 100%); color: white !important; padding: 15px 40px; text-decoration: none; border-radius: 5px; }
          .warning { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>We received a request to reset your password for your C3 Initiative account.</p>
            <p>Click the button below to create a new password:</p>
            
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3b82f6;">${resetUrl}</p>
            
            <div class="warning">
              <strong>⏰ Important:</strong> This link will expire in 1 hour for security.
            </div>
            
            <p><strong>Didn't request this?</strong> You can safely ignore this email. Your password will not be changed.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} C3 Initiative. All rights reserved.</p>
            <p style="color: #999; margin-top: 10px;">
              This is an automated security message. Please do not reply.
            </p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('[Brevo] ✅ Password reset email sent via noreply@')
    return { success: true, messageId: data.body.messageId }
  } catch (error: any) {
    console.error('[Brevo] ❌ Failed to send password reset email')
    return { success: false, error }
  }
}