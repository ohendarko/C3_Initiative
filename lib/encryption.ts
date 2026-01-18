// lib/encryption.ts
import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 64
const TAG_LENGTH = 16
const TAG_POSITION = SALT_LENGTH + IV_LENGTH
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH

/**
 * Get encryption key from environment
 */
function getKey(): string {
  const key = process.env.ENCRYPTION_KEY
  // Temporary debug - remove after confirming it works
  console.log('[Encryption] Key loaded:', key ? '✅ Yes' : '❌ No', `(length: ${key?.length || 0})`)
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }
  if (key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be 64 characters (32 bytes in hex)')
  }
  return key
}

/**
 * Encrypt a string value
 */
export function encrypt(text: string): string {
  if (!text) return text

  try {
    const iv = crypto.randomBytes(IV_LENGTH)
    const salt = crypto.randomBytes(SALT_LENGTH)

    const key = crypto.pbkdf2Sync(getKey(), salt, 100000, 32, 'sha512')
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ])

    const tag = cipher.getAuthTag()

    return Buffer.concat([salt, iv, tag, encrypted]).toString('base64')
  } catch (error) {
    console.error('[Encryption] Error encrypting:', error)
    throw new Error('Encryption failed')
  }
}

/**
 * Decrypt a string value
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return encryptedData

  try {
    const stringValue = Buffer.from(encryptedData, 'base64')

    const salt = stringValue.subarray(0, SALT_LENGTH)
    const iv = stringValue.subarray(SALT_LENGTH, TAG_POSITION)
    const tag = stringValue.subarray(TAG_POSITION, ENCRYPTED_POSITION)
    const encrypted = stringValue.subarray(ENCRYPTED_POSITION)

    const key = crypto.pbkdf2Sync(getKey(), salt, 100000, 32, 'sha512')

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    const decrypted = decipher.update(encrypted) + decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('[Encryption] Error decrypting:', error)
    throw new Error('Decryption failed')
  }
}

/**
 * Hash a value (one-way, cannot be decrypted)
 * Use for tokens, etc.
 */
export function hash(text: string): string {
  return crypto
    .createHash('sha256')
    .update(text + getKey())
    .digest('hex')
}

/**
 * Check if a string is encrypted (base64 format)
 */
export function isEncrypted(text: string): boolean {
  if (!text) return false
  // Encrypted data is base64, at least 100 chars long
  return /^[A-Za-z0-9+/]+=*$/.test(text) && text.length > 100
}

/**
 * Encrypt an object's sensitive fields
 */
export function encryptFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const encrypted = { ...obj }
  
  fields.forEach((field) => {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = encrypt(encrypted[field] as string) as any
    }
  })
  
  return encrypted
}

/**
 * Decrypt an object's sensitive fields
 */
export function decryptFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const decrypted = { ...obj }
  
  fields.forEach((field) => {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      try {
        decrypted[field] = decrypt(decrypted[field] as string) as any
      } catch (error) {
        console.error(`[Encryption] Failed to decrypt field: ${String(field)}`)
        // Keep original value if decryption fails
      }
    }
  })
  
  return decrypted
}