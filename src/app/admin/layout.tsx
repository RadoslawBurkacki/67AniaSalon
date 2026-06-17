'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/admin/login')
      else setChecking(false)
    })
  }, [pathname, router])

  if (checking && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="text-gold animate-spin" size={28} />
      </div>
    )
  }

  return <>{children}</>
}
