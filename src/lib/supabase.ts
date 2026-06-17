import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getBookingsForDate(date: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('date', date)
    .neq('status', 'cancelled')
  if (error) throw error
  return data
}

export async function getBlockedSlotsForDate(date: string) {
  const { data, error } = await supabase
    .from('blocked_slots')
    .select('*')
    .eq('date', date)
  if (error) throw error
  return data
}

export async function getAllBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: true })
    .order('time_slot', { ascending: true })
  if (error) throw error
  return data
}

export async function updateBookingStatus(id: string, status: string) {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}
