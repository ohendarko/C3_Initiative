// lib/prisma.ts
import { PrismaClient } from './generated/prisma'
import { encrypt, decrypt, isEncrypted } from './encryption'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

// Fields that should be encrypted
const QUESTIONNAIRE_ENCRYPTED_FIELDS = [
  'age',
  'gender',
  'relationshipStatus',
  'relationshipOther',
  'religion',
  'religionOther',
  'programOfStudy',
  'yearOfStudy',
  'sexuallyActive',
  'familyHistoryCancer',
  'cancerType',
  'cervicalCancerEducation',
  'papSmearTest',
  'hpvVaccine',
]

/**
 * Middleware to encrypt data before saving to database
 */
prisma.$use(async (params, next) => {
  // Only encrypt in create and update operations
  if (params.action === 'create' || params.action === 'update') {
    
    // Encrypt Questionnaire fields
    if (params.model === 'Questionnaire' && params.args.data) {
      QUESTIONNAIRE_ENCRYPTED_FIELDS.forEach((field) => {
        if (params.args.data[field] && typeof params.args.data[field] === 'string' && !isEncrypted(params.args.data[field])) {
          params.args.data[field] = encrypt(params.args.data[field])
        }
      })
    }
  }

  // Execute the query
  const result = await next(params)

  // Decrypt data after reading from database
  if (result) {
    // Handle single results
    if (typeof result === 'object' && !Array.isArray(result)) {
      if (params.model === 'Questionnaire') {
        decryptQuestionnaireData(result)
      }
    }

    // Handle array results
    if (Array.isArray(result)) {
      result.forEach((item) => {
        if (params.model === 'Questionnaire') {
          decryptQuestionnaireData(item)
        }
      })
    }
  }

  return result
})

/**
 * Decrypt Questionnaire data with robust error handling
 */
function decryptQuestionnaireData(questionnaire: any) {
  if (!questionnaire) return
  
  QUESTIONNAIRE_ENCRYPTED_FIELDS.forEach((field) => {
    const value = questionnaire[field]
    
    // Skip null/undefined
    if (!value) return
    
    // Skip non-strings
    if (typeof value !== 'string') return
    
    // Only decrypt if it looks encrypted
    if (!isEncrypted(value)) {
      // Not encrypted - leave as-is
      return
    }
    
    // Try to decrypt
    try {
      const decrypted = decrypt(value)
      questionnaire[field] = decrypted
    } catch (error: any) {
      // ✅ Better error handling - don't crash, just log and keep original value
      console.error(`[Encryption] Failed to decrypt questionnaire.${field}:`, error.message)
      // Leave the original value - better than crashing
      // If you want to mark failed decryptions, you could do:
      // questionnaire[field] = value // Keep encrypted value
      // or
      // questionnaire[field] = '[Decryption Failed]'
    }
  })
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma