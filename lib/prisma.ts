
// import { PrismaClient } from "@/lib/generated/prisma";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ['query'],
//   })

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
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
const USER_ENCRYPTED_FIELDS = ['firstName', 'lastName']
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
    
    // Encrypt User fields
    if (params.model === 'User' && params.args.data) {
      USER_ENCRYPTED_FIELDS.forEach((field) => {
        if (params.args.data[field] && !isEncrypted(params.args.data[field])) {
          params.args.data[field] = encrypt(params.args.data[field])
        }
      })
    }

    // Encrypt Questionnaire fields
    if (params.model === 'Questionnaire' && params.args.data) {
      QUESTIONNAIRE_ENCRYPTED_FIELDS.forEach((field) => {
        if (params.args.data[field] && typeof params.args.data[field] === 'string' && !isEncrypted(params.args.data[field])) {
          params.args.data[field] = encrypt(params.args.data[field])
        }
      })
    }

    // Encrypt Certificate fields
    // if (params.model === 'Certificate' && params.args.data) {
    //   CERTIFICATE_ENCRYPTED_FIELDS.forEach((field) => {
    //     if (params.args.data[field] && !isEncrypted(params.args.data[field])) {
    //       params.args.data[field] = encrypt(params.args.data[field])
    //     }
    //   })
    // }
  }

  // Execute the query
  const result = await next(params)

  // Decrypt data after reading from database
  if (result) {
    // Handle single results
    if (typeof result === 'object' && !Array.isArray(result)) {
      if (params.model === 'User') {
        decryptUserData(result)
      } else if (params.model === 'Questionnaire') {
        decryptQuestionnaireData(result)
      } 
      // else if (params.model === 'Certificate') {
      //   decryptCertificateData(result)
      // }
    }

    // Handle array results
    if (Array.isArray(result)) {
      result.forEach((item) => {
        if (params.model === 'User') {
          decryptUserData(item)
        } else if (params.model === 'Questionnaire') {
          decryptQuestionnaireData(item)
        } 
        // else if (params.model === 'Certificate') {
        //   decryptCertificateData(item)
        // }
      })
    }
  }

  return result
})

/**
 * Decrypt User data
 */
function decryptUserData(user: any) {
  if (!user) return
  
  USER_ENCRYPTED_FIELDS.forEach((field) => {
    if (user[field] && isEncrypted(user[field])) {
      try {
        user[field] = decrypt(user[field])
      } catch (error) {
        console.error(`[Encryption] Failed to decrypt user.${field}`)
      }
    }
  })
}

/**
 * Decrypt Questionnaire data
 */
function decryptQuestionnaireData(questionnaire: any) {
  if (!questionnaire) return
  
  QUESTIONNAIRE_ENCRYPTED_FIELDS.forEach((field) => {
    if (questionnaire[field] && isEncrypted(questionnaire[field])) {
      try {
        questionnaire[field] = decrypt(questionnaire[field])
      } catch (error) {
        console.error(`[Encryption] Failed to decrypt questionnaire.${field}`)
      }
    }
  })
}

/**
 * Decrypt Certificate data
 */
// function decryptCertificateData(certificate: any) {
//   if (!certificate) return
  
//   CERTIFICATE_ENCRYPTED_FIELDS.forEach((field) => {
//     if (certificate[field] && isEncrypted(certificate[field])) {
//       try {
//         certificate[field] = decrypt(certificate[field])
//       } catch (error) {
//         console.error(`[Encryption] Failed to decrypt certificate.${field}`)
//       }
//     }
//   })
// }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma