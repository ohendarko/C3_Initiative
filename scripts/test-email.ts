// scripts/test-email.ts
import { sendVerificationEmail } from '../lib/email'

async function test() {
  console.log('Testing Brevo email...')
  
  const result = await sendVerificationEmail(
    'your-test-email@gmail.com',
    'Test User',
    'test-token-12345'
  )
  
  console.log('Result:', result)
}

test()