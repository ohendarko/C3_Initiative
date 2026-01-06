// lib/email-test.ts
import nodemailer from 'nodemailer'

let testAccount: any = null
let transporter: any = null

async function getTestTransporter() {
  if (!testAccount) {
    // Create a test account on Ethereal
    testAccount = await nodemailer.createTestAccount()
    console.log('📧 Test Email Account Created:')
    console.log('Email:', testAccount.user)
    console.log('Password:', testAccount.pass)
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  }

  return transporter
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
  const transporter = await getTestTransporter()

  const mailOptions = {
    from: '"C3 Initiative" <noreply@c3initiative.test>',
    to: email,
    subject: 'Verify Your Email - C3 Initiative',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
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
              <p>Thank you for signing up! Please verify your email address.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link:</p>
              <div class="link-text">${verificationUrl}</div>
              
              <div class="warning">
                <strong>⏰ Important:</strong> This link expires in 24 hours.
              </div>
              
              <p>If you didn't create an account, ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} C3 Initiative. All rights reserved.</p>
              <p>🧪 <strong>TEST EMAIL</strong> - This is a test verification email</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    const previewUrl = nodemailer.getTestMessageUrl(info)
    
    console.log('✅ Email sent successfully!')
    console.log('📬 Preview URL:', previewUrl)
    console.log('📧 Message ID:', info.messageId)
    
    return { 
      success: true, 
      messageId: info.messageId,
      previewUrl 
    }
  } catch (error) {
    console.error('❌ Email error:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/learn/cervical-cancer`
  const transporter = await getTestTransporter()

  const mailOptions = {
    from: '"C3 Initiative" <noreply@c3initiative.test>',
    to: email,
    subject: 'Welcome to C3 Initiative! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
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
            .success-icon {
              text-align: center;
              font-size: 60px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #f97316 0%, #3b82f6 100%);
              color: white !important;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
            .features {
              background: #f0f9ff;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .footer {
              background: #f9fafb;
              padding: 20px 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verified Successfully!</h1>
            </div>
            <div style="padding: 40px 30px;">
              <div class="success-icon">✅</div>
              <h2 style="text-align: center; color: #10b981;">Welcome, ${name}!</h2>
              <p style="text-align: center;">Your email has been verified and your account is now active.</p>
              
              <div class="features">
                <h3 style="margin-top: 0; color: #3b82f6;">What's Next?</h3>
                <ul>
                  <li>📚 Access 6 comprehensive learning modules</li>
                  <li>🎯 Complete interactive quizzes</li>
                  <li>🏆 Earn your certificate</li>
                  <li>💡 Learn about prevention and treatment</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardUrl}" class="button">Start Learning Now</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} C3 Initiative. All rights reserved.</p>
              <p>🧪 <strong>TEST EMAIL</strong> - This is a test welcome email</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    const previewUrl = nodemailer.getTestMessageUrl(info)
    
    console.log('✅ Welcome email sent!')
    console.log('📬 Preview URL:', previewUrl)
    
    return { 
      success: true, 
      messageId: info.messageId,
      previewUrl 
    }
  } catch (error) {
    console.error('❌ Email error:', error)
    return { success: false, error }
  }
}