import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET() {
  const supabase = createClient(URL, ANON)
  const { data, error } = await supabase.from('settings').select('key, value')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const settings = Object.fromEntries((data ?? []).map(r => [r.key, r.value]))
  return NextResponse.json({ settings })
}

export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createClient(URL, ANON, {
    global: { headers: { Authorization: authHeader } },
  })

  const body = await req.json()

  // Accept either { key, value } (single) or { settings: { key: value, ... } } (bulk)
  const pairs: { key: string; value: string }[] = body.settings
    ? Object.entries(body.settings as Record<string, string>).map(([key, value]) => ({ key, value }))
    : [{ key: body.key, value: String(body.value) }]

  if (pairs.length === 0 || pairs.some(p => !p.key)) {
    return NextResponse.json({ error: 'key and value required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('settings')
    .upsert(pairs.map(p => ({ ...p, updated_at: new Date().toISOString() })))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
