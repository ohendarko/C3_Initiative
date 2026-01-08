// scripts/test-brevo.ts
import * as brevo from '@getbrevo/brevo'
import dotenv from 'dotenv'

// ✅ Load environment variables
dotenv.config({ path: '.env.local' })

async function testBrevo() {
  console.log('🧪 Testing Brevo Connection...\n')

  // Check API key
  const apiKey = process.env.BREVO_API_KEY
  console.log('1. Checking API Key...')
  console.log('   API Key present:', !!apiKey)
  
  if (!apiKey) {
    console.error('   ❌ BREVO_API_KEY not found!')
    console.error('   Make sure .env.local exists with BREVO_API_KEY=xkeysib-...')
    return
  }
  
  console.log('   ✅ API Key found:', apiKey.substring(0, 20) + '...')

  // Initialize Brevo
  console.log('\n2. Initializing Brevo API...')
  const apiInstance = new brevo.TransactionalEmailsApi()
  
  // ✅ This is the correct way to set the API key
  apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    apiKey
  )
  
  console.log('   ✅ API initialized')

  // Test sending email
  console.log('\n3. Sending test email...')

  const sendSmtpEmail = new brevo.SendSmtpEmail()
  sendSmtpEmail.sender = { 
    name: 'C3 Initiative', 
    email: process.env.BREVO_SENDER_EMAIL || 'noreply@yourdomain.com'
  }
  sendSmtpEmail.to = [{ 
    email: 'your-real-email@gmail.com',  // ✅ Change this to your actual email
    name: 'Test User' 
  }]
  sendSmtpEmail.subject = 'Test Email from C3 Initiative'
  sendSmtpEmail.htmlContent = `
    <html>
      <body>
        <h1>Test Email ✅</h1>
        <p>If you received this, Brevo is working!</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      </body>
    </html>
  `

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('\n✅ SUCCESS! Email sent!')
    console.log('   Message ID:', data.body.messageId)
    console.log('\n🎉 Brevo is configured correctly!')
  } catch (error: any) {
    console.error('\n❌ FAILED to send email')
    console.error('Error message:', error?.message)
    console.error('Error code:', error?.response?.body?.code)
    console.error('Error detail:', error?.response?.body?.message)
  }
}

testBrevo()