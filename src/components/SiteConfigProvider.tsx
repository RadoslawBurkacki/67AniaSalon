'use client'

import { createContext, useContext } from 'react'
import { type SiteConfig, defaultSiteConfig } from '@/lib/site-config'

const SiteConfigContext = createContext<SiteConfig>(defaultSiteConfig)

export function SiteConfigProvider({
  initialConfig,
  children,
}: {
  initialConfig: SiteConfig
  children: React.ReactNode
}) {
  return (
    <SiteConfigContext.Provider value={initialConfig}>
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig() {
  return useContext(SiteConfigContext)
}
