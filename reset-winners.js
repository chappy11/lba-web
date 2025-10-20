// Helper function to reset all winners to TBA for testing
// This can be run once to fix existing tournament data

export async function resetAllWinnersToTBA() {
  try {
    console.log("Resetting all elimination match winners to TBA...")
    
    // Get elimination matches
    const matches = await getMatchSchedule(GameType.ELIMINATION)
    
    if (!matches || matches.length === 0) {
      console.log("No elimination matches found")
      return
    }
    
    const eliminationSchedule = matches[0]
    
    // Reset all winners to TBA
    const resetMatchSchedule = eliminationSchedule.matchSchedule.map(round => ({
      ...round,
      matches: round.matches.map(match => ({
        ...match,
        winner: "TBA"
      }))
    }))
    
    // Update in database
    const docRef = doc(db, FirebaseCollection.MATCH_SCHEDULE, eliminationSchedule.id)
    await updateDoc(docRef, {
      matchSchedule: resetMatchSchedule
    })
    
    console.log("✅ Successfully reset all winners to TBA")
    return true
    
  } catch (error) {
    console.error("Error resetting winners:", error)
    throw error
  }
}