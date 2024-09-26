'use client'
import { createStore, Provider } from 'jotai'
import { type ReactNode } from 'react'

export const layoutJotaiStore = createStore()

export function LayoutJotaiProvider({ children }: { children: ReactNode }) {
  return <Provider store={layoutJotaiStore}>{children}</Provider>
}
