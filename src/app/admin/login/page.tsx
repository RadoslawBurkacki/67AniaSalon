'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      document.cookie = `admin-auth=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 border border-gold/30 flex items-center justify-center mx-auto mb-6">
            <Lock size={20} className="text-gold" />
          </div>
          <h1 className="font-serif text-2xl text-cream mb-2">Admin Access</h1>
          <p className="text-cream/40 text-sm">Sign in to manage bookings</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs text-cream/50 tracking-wider uppercase mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-surface border border-border focus:border-gold outline-none px-4 py-3 text-cream placeholder:text-cream/20 transition-colors"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-cream/50 tracking-wider uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-surface border border-border focus:border-gold outline-none px-4 py-3 text-cream placeholder:text-cream/20 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400/80 text-sm text-center">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
