export const clearUserCache = (userEmail: string) => {
  if (!userEmail) return

  const keysToRemove = [
    `c3-moduleSummary-${userEmail}`,
    `c3-summaryCount-${userEmail}`,
    `c3-progress-${userEmail}`,
  ]

  // 🔁 Remove all lesson keys like: c3-lesson-[userEmail]-module-1
  for (let i = 1; i <= 10; i++) {
    const lessonKey = `c3-lesson-${userEmail}-module-${i}`
    keysToRemove.push(lessonKey)
  }

  // 🔎 Also catch any unexpected lesson keys dynamically
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`c3-lesson-${userEmail}-`)) {
      localStorage.removeItem(key)
    }
  })

  // 🧹 Remove everything
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}
