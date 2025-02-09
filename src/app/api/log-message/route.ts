import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json()
    
    // Log the message server-side
    console.log(`[Server] Message from ${userId}: ${message}`)
    
    // Here you could:
    // 1. Save to a database
    // 2. Send to an analytics service
    // 3. Trigger other server-side actions
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging message:', error)
    return NextResponse.json({ success: false, error: 'Failed to log message' }, { status: 500 })
  }
}
