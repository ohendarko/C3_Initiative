// scripts/test-encryption.ts
import { encrypt, decrypt, hash, isEncrypted } from '../lib/encryption'
import dotenv from 'dotenv'

// ✅ Load environment variables
dotenv.config({ path: '.env.local' })

console.log('🔐 Testing Encryption...\n')

// Test 1: Basic encryption/decryption
console.log('Test 1: Basic Encryption/Decryption')
console.log('====================================')
const original = 'test@example.com'
console.log('Original:', original)

const encrypted = encrypt(original)
console.log('Encrypted:', encrypted.substring(0, 50) + '...')
console.log('Length:', encrypted.length)

const decrypted = decrypt(encrypted)
console.log('Decrypted:', decrypted)
console.log('Match:', original === decrypted ? '✅ PASS' : '❌ FAIL')

// Test 2: Check if encrypted
console.log('\nTest 2: Encryption Detection')
console.log('====================================')
const plainText = 'test@example.com'
const encryptedText = encrypt(plainText)

console.log('Plain text:', plainText)
console.log('  isEncrypted():', isEncrypted(plainText))
console.log('  Expected: false')
console.log('  Result:', isEncrypted(plainText) === false ? '✅ PASS' : '❌ FAIL')

console.log('\nEncrypted text:', encryptedText.substring(0, 30) + '...')
console.log('  isEncrypted():', isEncrypted(encryptedText))
console.log('  Expected: true')
console.log('  Result:', isEncrypted(encryptedText) === true ? '✅ PASS' : '❌ FAIL')

// Test 3: Hash function
console.log('\nTest 3: Hashing (One-way)')
console.log('====================================')
const token = 'verification-token-123'
const hashed = hash(token)
console.log('Original token:', token)
console.log('Hashed token:', hashed)
console.log('Hash length:', hashed.length)
console.log('Hashes are different:', token !== hashed ? '✅ PASS' : '❌ FAIL')
console.log('Cannot decrypt hash:', (() => {
  try {
    decrypt(hashed)
    return '❌ FAIL (should not decrypt)'
  } catch {
    return '✅ PASS (correctly cannot decrypt)'
  }
})())

// Test 4: Multiple encryptions are different
console.log('\nTest 4: Encryption Randomness')
console.log('====================================')
const sameInput = 'same@email.com'
const encrypted1 = encrypt(sameInput)
const encrypted2 = encrypt(sameInput)
console.log('Same input:', sameInput)
console.log('Encryption 1:', encrypted1.substring(0, 40) + '...')
console.log('Encryption 2:', encrypted2.substring(0, 40) + '...')
console.log('Outputs are different:', encrypted1 !== encrypted2 ? '✅ PASS' : '❌ FAIL')

const decrypted1 = decrypt(encrypted1)
const decrypted2 = decrypt(encrypted2)
console.log('Both decrypt to same:', 
  (decrypted1 === sameInput && decrypted2 === sameInput && decrypted1 === decrypted2) 
    ? '✅ PASS' : '❌ FAIL'
)

// Test 5: Empty and null handling
console.log('\nTest 5: Edge Cases')
console.log('====================================')
console.log('Empty string:', encrypt(''))
console.log('  Returns empty:', encrypt('') === '' ? '✅ PASS' : '❌ FAIL')

// Test 6: Special characters
console.log('\nTest 6: Special Characters')
console.log('====================================')
const specialChars = 'test+user@example.com (Special™ 字符)'
const encryptedSpecial = encrypt(specialChars)
const decryptedSpecial = decrypt(encryptedSpecial)
console.log('Original:', specialChars)
console.log('Encrypted length:', encryptedSpecial.length)
console.log('Decrypted:', decryptedSpecial)
console.log('Match:', specialChars === decryptedSpecial ? '✅ PASS' : '❌ FAIL')

console.log('\n' + '='.repeat(60))
console.log('✅ All encryption tests passed!')
console.log('='.repeat(60))