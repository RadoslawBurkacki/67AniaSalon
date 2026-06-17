import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, service_category, service_name, duration_minutes, date, time_slot, notes } = body

    if (!name || !email || !phone || !service_category || !service_name || !date || !time_slot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check slot isn't already taken
    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time_slot', time_slot)
      .neq('status', 'cancelled')
      .single()

    if (existing) {
      return NextResponse.json({ error: 'This time slot is no longer available. Please choose another.' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({ name, email, phone, service_category, service_name, duration_minutes, date, time_slot, notes: notes || null, status: 'pending' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ booking: data }, { status: 201 })
  } catch (e) {
    console.error('Booking error:', e)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true })

    if (error) throw error
    return NextResponse.json({ bookings: data })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
