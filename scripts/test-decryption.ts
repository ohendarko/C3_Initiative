// scripts/test-decryption.ts

import crypto from 'crypto'
import * as dotenv from 'dotenv'
import * as path from 'path'

// ✅ Load .env file
dotenv.config({ path: path.join(process.cwd(), '.env') })
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 64
const TAG_LENGTH = 16
const TAG_POSITION = SALT_LENGTH + IV_LENGTH
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH

// Copy from your database
const encryptedValue = "L1j8UUWoRoPJ7uoka/CyYqzS1kIYn2fp1JDJ6xCuiAEAMiw6OIZnhKbWCgjUL04riFvnGcoVu7UD/6Gdl6sn48X+hC+Omjz/HeAcJY1bnDc9CyVritw2lflg4RjRjJ7g7fDq"

function testDecrypt(encryptedData: string, key: string) {
  try {
    const stringValue = Buffer.from(encryptedData, 'base64')
    const salt = stringValue.subarray(0, SALT_LENGTH)
    const iv = stringValue.subarray(SALT_LENGTH, TAG_POSITION)
    const tag = stringValue.subarray(TAG_POSITION, ENCRYPTED_POSITION)
    const encrypted = stringValue.subarray(ENCRYPTED_POSITION)

    const derivedKey = crypto.pbkdf2Sync(key, salt, 100000, 32, 'sha512')
    const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv)
    decipher.setAuthTag(tag)

    const decrypted = decipher.update(encrypted) + decipher.final('utf8')
    return { success: true, value: decrypted }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

console.log('🔍 Testing decryption with current ENCRYPTION_KEY...\n')

const currentKey = process.env.ENCRYPTION_KEY || ''

console.log('Current ENCRYPTION_KEY:', currentKey ? currentKey.substring(0, 20) + '...' : '❌ NOT FOUND')
console.log('Key length:', currentKey.length)
console.log('Encrypted value:', encryptedValue.substring(0, 50) + '...\n')

if (!currentKey) {
  console.log('❌ ERROR: ENCRYPTION_KEY not found in environment variables!')
  console.log('\nChecked files:')
  console.log('  - .env')
  console.log('  - .env.local')
  console.log('\nMake sure one of these files exists and contains:')
  console.log('  ENCRYPTION_KEY=your_64_character_key_here\n')
  process.exit(1)
}

if (currentKey.length !== 64) {
  console.log(`❌ ERROR: ENCRYPTION_KEY must be 64 characters, but found ${currentKey.length}`)
  console.log('\nGenerate a new key with:')
  console.log('  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"')
  process.exit(1)
}

const result = testDecrypt(encryptedValue, currentKey)

if (result.success) {
  console.log('✅ SUCCESS! Decrypted value:', result.value)
} else {
  console.log('❌ FAILED! Error:', result.error)
  console.log('\n⚠️  This means your ENCRYPTION_KEY is WRONG or CHANGED!')
  console.log('\nPossible causes:')
  console.log('1. You regenerated the ENCRYPTION_KEY')
  console.log('2. You\'re using a different .env file')
  console.log('3. The key in production differs from development')
  console.log('4. You copied data from another environment\n')
}