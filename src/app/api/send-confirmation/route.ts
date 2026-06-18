import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendBookingConfirmed } from '@/lib/email'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json()
    if (!bookingId) return NextResponse.json({ error: 'bookingId required' }, { status: 400 })

    // Fetch the booking — only send if it's actually confirmed
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('status', 'confirmed')
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: 'Booking not found or not confirmed' }, { status: 404 })
    }

    await sendBookingConfirmed(booking)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Confirmation email error:', e)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
