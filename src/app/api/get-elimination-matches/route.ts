import { getEliminationMatchSchedule } from '@/_lib/server/matchSchedule'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const eliminationMatches = await getEliminationMatchSchedule()
    
    if (!eliminationMatches || eliminationMatches.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No elimination tournament found',
        data: null
      })
    }

    return NextResponse.json({
      success: true,
      data: eliminationMatches[0],
      message: 'Elimination tournament data retrieved successfully'
    })

  } catch (error) {
    console.error('Error getting elimination matches:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to get elimination matches',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}