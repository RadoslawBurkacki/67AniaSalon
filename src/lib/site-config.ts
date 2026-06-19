import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'

export interface SiteConfig {
  address: string
  phone: string
  email: string
  mapUrl: string
  hoursMon: string
  hoursSat: string
  hoursSun: string
  instagram: string
  facebook: string
}

export const DEFAULT_MAP_URL =
  'https://maps.google.com/maps?q=102+Pettigrew+Street,+Glasgow,+G32+7XU&output=embed&z=16'

export const defaultSiteConfig: SiteConfig = {
  address: '102 Pettigrew Street\nGlasgow, G32 7XU',
  phone: '+44 7700 000000',
  email: 'hello@anyasalon.com',
  mapUrl: DEFAULT_MAP_URL,
  hoursMon: '9:00 AM – 6:00 PM',
  hoursSat: '9:00 AM – 5:00 PM',
  hoursSun: 'Closed',
  instagram: '',
  facebook: '',
}

export async function getSiteConfig(): Promise<SiteConfig> {
  noStore()
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase.from('settings').select('key, value')
    const s = Object.fromEntries((data ?? []).map(r => [r.key, r.value as string]))
    return {
      address: s.site_address || defaultSiteConfig.address,
      phone: s.site_phone || defaultSiteConfig.phone,
      email: s.site_email || defaultSiteConfig.email,
      mapUrl: s.site_map_url || defaultSiteConfig.mapUrl,
      hoursMon: s.hours_mon_fri || defaultSiteConfig.hoursMon,
      hoursSat: s.hours_sat || defaultSiteConfig.hoursSat,
      hoursSun: s.hours_sun || defaultSiteConfig.hoursSun,
      instagram: s.social_instagram ?? '',
      facebook: s.social_facebook ?? '',
    }
  } catch {
    return defaultSiteConfig
  }
}
