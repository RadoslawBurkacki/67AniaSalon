'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { type Booking } from '@/lib/types'
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, LogOut, RefreshCw, Calendar, List } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type View = 'calendar' | 'list'

const STATUS_STYLES = {
  pending: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  confirmed: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  cancelled: 'text-cream/30 border-cream/10 bg-cream/5',
}

export default function AdminPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('calendar')
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date())
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('bookings').select('*').order('date').order('time_slot')
    setBookings((data as Booking[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    await supabase.from('bookings').update({ status }).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as Booking['status'] } : b))
    if (status === 'confirmed') {
      fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id }),
      }).catch(err => console.error('Confirmation email failed:', err))
    }
    setUpdatingId(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    document.cookie = 'admin-auth=; path=/; max-age=0; SameSite=Strict'
    router.push('/admin/login')
  }

  const monthDays = eachDayOfInterval({ start: startOfMonth(calendarMonth), end: endOfMonth(calendarMonth) })
  const dayBookings = (day: Date) => bookings.filter(b => isSameDay(parseISO(b.date), day))
  const selectedDayBookings = selectedDay ? dayBookings(selectedDay).sort((a, b) => a.time_slot.localeCompare(b.time_slot)) : []

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    today: bookings.filter(b => b.date === format(new Date(), 'yyyy-MM-dd')).length,
  }

  return (
    <div className="min-h-screen bg-background text-cream">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="section-container flex items-center justify-between h-16">
          <Link href="/" className="font-serif text-lg">
            <span className="gold-text">Anya</span>
            <span className="text-cream/40 text-xs tracking-widest ml-1 font-sans">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={fetchBookings} disabled={loading} className="text-cream/40 hover:text-gold transition-colors" title="Refresh">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-cream/40 hover:text-gold text-sm transition-colors">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="section-container py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: stats.total, color: 'text-cream' },
            { label: 'Today', value: stats.today, color: 'text-gold' },
            { label: 'Pending', value: stats.pending, color: 'text-amber-400' },
            { label: 'Confirmed', value: stats.confirmed, color: 'text-emerald-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-surface border border-border p-5">
              <div className={`font-serif text-3xl font-light mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-cream/40 text-xs tracking-wider uppercase">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-4 mb-6">
          <h1 className="font-serif text-2xl text-cream">Bookings</h1>
          <div className="flex border border-border ml-auto">
            {([
              { id: 'calendar' as const, Icon: Calendar, label: 'Calendar' },
              { id: 'list' as const, Icon: List, label: 'List' },
            ] as const).map(({ id, Icon, label }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs transition-all duration-300 ${
                  view === id ? 'bg-gold text-background' : 'text-cream/50 hover:text-cream'
                }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* CALENDAR VIEW */}
        {view === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar grid */}
            <div className="lg:col-span-2 bg-surface border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl">{format(calendarMonth, 'MMMM yyyy')}</h2>
                <div className="flex gap-2">
                  <button onClick={() => setCalendarMonth(m => subMonths(m, 1))} className="text-cream/40 hover:text-gold transition-colors p-1">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setCalendarMonth(m => addMonths(m, 1))} className="text-cream/40 hover:text-gold transition-colors p-1">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <div key={d} className="text-center text-xs text-cream/30 tracking-wider py-2">{d}</div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {/* Offset for first day */}
                {Array.from({ length: (monthDays[0].getDay() + 6) % 7 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {monthDays.map(day => {
                  const daybkgs = dayBookings(day)
                  const isSelected = selectedDay && isSameDay(day, selectedDay)
                  const hasBookings = daybkgs.length > 0
                  const hasPending = daybkgs.some(b => b.status === 'pending')
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDay(day)}
                      className={`relative aspect-square flex flex-col items-center justify-center text-sm transition-all duration-200 rounded-sm ${
                        isSelected ? 'bg-gold text-background font-medium' :
                        isToday(day) ? 'border border-gold/50 text-gold' :
                        'hover:bg-elevated text-cream/70'
                      }`}
                    >
                      {day.getDate()}
                      {hasBookings && !isSelected && (
                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${hasPending ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Day detail */}
            <div className="bg-surface border border-border p-6">
              <h3 className="font-serif text-lg mb-1">
                {selectedDay ? format(selectedDay, 'EEEE') : 'Select a day'}
              </h3>
              <p className="text-cream/40 text-sm mb-6">
                {selectedDay ? format(selectedDay, 'd MMMM yyyy') : ''}
              </p>

              {selectedDayBookings.length === 0 ? (
                <p className="text-cream/30 text-sm">No bookings for this day</p>
              ) : (
                <div className="space-y-3">
                  {selectedDayBookings.map(b => (
                    <BookingCard key={b.id} booking={b} updatingId={updatingId} onUpdate={updateStatus} compact />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div className="space-y-2">
            {loading ? (
              <p className="text-cream/30 py-8 text-center">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-cream/30 py-8 text-center">No bookings yet</p>
            ) : (
              bookings.map(b => (
                <BookingCard key={b.id} booking={b} updatingId={updatingId} onUpdate={updateStatus} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingCard({
  booking: b,
  updatingId,
  onUpdate,
  compact = false,
}: {
  booking: Booking
  updatingId: string | null
  onUpdate: (id: string, status: string) => void
  compact?: boolean
}) {
  const isUpdating = updatingId === b.id

  return (
    <motion.div
      layout
      className={`border ${compact ? 'border-border p-4' : 'border-border bg-surface p-5'} transition-colors`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-cream font-medium text-sm">{b.name}</span>
            <span className={`text-xs border px-2 py-0.5 ${STATUS_STYLES[b.status]}`}>
              {b.status}
            </span>
          </div>
          <div className="text-gold text-sm mt-1">{b.service_name}</div>
          {!compact && (
            <div className="text-cream/40 text-xs mt-1">{b.email} · {b.phone}</div>
          )}
          <div className="flex items-center gap-1.5 text-cream/40 text-xs mt-1.5">
            <Clock size={11} />
            {compact ? b.time_slot : `${format(parseISO(b.date), 'd MMM yyyy')} at ${b.time_slot}`}
            · {b.duration_minutes}min
          </div>
          {b.notes && <p className="text-cream/30 text-xs mt-1.5 italic">{b.notes}</p>}
        </div>

        {b.status !== 'cancelled' && (
          <div className="flex gap-2 shrink-0">
            {b.status === 'pending' && (
              <button
                onClick={() => onUpdate(b.id, 'confirmed')}
                disabled={isUpdating}
                title="Confirm"
                className="text-emerald-400/60 hover:text-emerald-400 transition-colors disabled:opacity-30"
              >
                <CheckCircle size={18} />
              </button>
            )}
            <button
              onClick={() => onUpdate(b.id, 'cancelled')}
              disabled={isUpdating}
              title="Cancel"
              className="text-red-400/40 hover:text-red-400 transition-colors disabled:opacity-30"
            >
              <XCircle size={18} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
