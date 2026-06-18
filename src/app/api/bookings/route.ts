import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NAIL_SERVICES, MASSAGE_SERVICES, TIME_SLOTS } from '@/lib/types'

export const dynamic = 'force-dynamic'

const ALL_SERVICES = [...NAIL_SERVICES, ...MASSAGE_SERVICES]
const VALID_IDS = new Set(ALL_SERVICES.map(s => s.id))
const VALID_SLOTS = new Set(TIME_SLOTS)
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const bookingSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(30),
  service_id: z.string().refine(id => VALID_IDS.has(id), { message: 'Invalid service' }),
  date: z.string().regex(DATE_RE),
  time_slot: z.string().refine(t => VALID_SLOTS.has(t), { message: 'Invalid time slot' }),
  notes: z.string().max(1000).optional(),
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ratelimit = process.env.UPSTASH_REDIS_REST_URL
  ? new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, '60 s') })
  : null

export async function POST(req: NextRequest) {
  if (ratelimit) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }
  }

  try {
    const body = await req.json()
    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    const { name, email, phone, service_id, date, time_slot, notes } = parsed.data

    if (date < new Date().toISOString().slice(0, 10)) {
      return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 })
    }

    const service = ALL_SERVICES.find(s => s.id === service_id)!

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
      .insert({
        name,
        email,
        phone,
        service_category: service.category,
        service_name: service.name,
        duration_minutes: service.duration,
        date,
        time_slot,
        notes: notes || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ booking: data }, { status: 201 })
  } catch (e) {
    console.error('Booking error:', e)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
