// scripts/test-email-local.ts
import { sendVerificationEmail, sendWelcomeEmail } from '../lib/email-test'

async function test() {
  console.log('🧪 Testing email system locally...\n')

  // Test 1: Verification Email
  console.log('📧 Test 1: Sending verification email...')
  const result1 = await sendVerificationEmail(
    'test@example.com',
    'John Doe',
    'test-token-abc123'
  )
  
  if (result1.success && result1.previewUrl) {
    console.log('\n✅ Verification email test complete!')
    console.log('🌐 Open this URL to see the email:', result1.previewUrl)
  }

  console.log('\n' + '='.repeat(60) + '\n')

  // Test 2: Welcome Email
  console.log('📧 Test 2: Sending welcome email...')
  const result2 = await sendWelcomeEmail(
    'test@example.com',
    'John Doe'
  )
  
  if (result2.success && result2.previewUrl) {
    console.log('\n✅ Welcome email test complete!')
    console.log('🌐 Open this URL to see the email:', result2.previewUrl)
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n🎉 All email tests complete!')
  console.log('💡 Click the preview URLs above to see your emails\n')
}

test()