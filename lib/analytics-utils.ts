
import crypto from 'crypto'

/**
 * Generate anonymous participant ID from user ID
 * Same user always gets same ID (deterministic)
 * @param userId - MongoDB ObjectId string
 * @returns Anonymous ID like "P-a4f89c2d"
 */
export function generateParticipantId(userId: string): string {
  // Create SHA-256 hash of user ID
  const hash = crypto
    .createHash('sha256')
    .update(userId)
    .digest('hex')
  
  // Take first 8 characters
  const shortHash = hash.substring(0, 8)
  
  return `C3-${shortHash}`
}

/**
 * Optional: Re-identify a participant ID (admin only)
 * @param participantId - Anonymous ID like "P-a4f89c2d"
 * @param userIds - Array of user IDs to check against
 * @returns Original user ID or null
 */
export function reidentifyParticipant(
  participantId: string, 
  userIds: string[]
): string | null {
  const targetHash = participantId.replace('P-', '')
  
  for (const userId of userIds) {
    const hash = crypto
      .createHash('sha256')
      .update(userId)
      .digest('hex')
      .substring(0, 8)
    
    if (hash === targetHash) {
      return userId
    }
  }
  
  return null
}