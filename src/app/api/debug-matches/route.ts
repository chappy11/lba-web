import { getEliminationMatchSchedule, getMatchSchedule } from '@/_lib/server/matchSchedule'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('=== DEBUG API CALLED ===')
    
    const allMatches = await getMatchSchedule()
    const eliminationMatches = await getEliminationMatchSchedule()
    
    console.log('All matches count:', allMatches?.length)
    console.log('Elimination matches count:', eliminationMatches?.length)
    
    console.log('All matches:', allMatches?.map(m => ({ id: m.id, type: m.matchType })))
    console.log('Elimination matches:', eliminationMatches?.map(m => ({ id: m.id, type: m.matchType })))

    return NextResponse.json({
      success: true,
      data: {
        allMatches: allMatches || [],
        eliminationMatches: eliminationMatches || [],
        allMatchesCount: allMatches?.length || 0,
        eliminationMatchesCount: eliminationMatches?.length || 0
      }
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}