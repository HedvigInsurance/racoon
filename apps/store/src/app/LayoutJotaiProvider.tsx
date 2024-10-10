'use client'
import { Provider } from 'jotai'
import { type ReactNode } from 'react'
import { globalStore } from 'globalStore'

export function LayoutJotaiProvider({ children }: { children: ReactNode }) {
  return <Provider store={globalStore}>{children}</Provider>
}
