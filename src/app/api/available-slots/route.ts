import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'date is required' }, { status: 400 })

  try {
    const [bookingsRes, blockedRes] = await Promise.all([
      supabase.from('bookings').select('time_slot').eq('date', date).neq('status', 'cancelled'),
      supabase.from('blocked_slots').select('time_slot, all_day').eq('date', date),
    ])

    const bookedSlots = bookingsRes.data?.map(b => b.time_slot) ?? []
    const blockedSlots = blockedRes.data ?? []

    const allDayBlock = blockedSlots.some(b => b.all_day)

    const unavailable = allDayBlock
      ? ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00']
      : Array.from(new Set([...bookedSlots, ...blockedSlots.filter(b => b.time_slot).map(b => b.time_slot)]))

    return NextResponse.json({ bookedSlots: unavailable })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}
