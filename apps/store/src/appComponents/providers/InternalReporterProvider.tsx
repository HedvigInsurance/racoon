'use client'

import { createContext, type ReactNode, useRef } from 'react'
import { InternalEventReporter } from '@/services/Tracking/InternalEventReporter'

export const InternalReporterContext = createContext<InternalEventReporter | null>(null)

export function InternalReporterProvider({ children }: { children: ReactNode }) {
  const reporterRef = useRef<InternalEventReporter>()
  if (reporterRef.current == null) {
    reporterRef.current = new InternalEventReporter()
  }
  return (
    <InternalReporterContext.Provider value={reporterRef.current}>
      {children}
    </InternalReporterContext.Provider>
  )
}
