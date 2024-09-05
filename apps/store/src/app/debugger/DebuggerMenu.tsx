'use client'
import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'
import { Text, yStack } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'

export function DebuggerMenu() {
  return (
    <div className={yStack({ alignItems: 'stretch' })}>
      <MenuItem href="/debugger/session">Session debugger</MenuItem>
      <MenuItem href="/debugger/iframe">iframe debugger</MenuItem>
      <MenuItem href="/debugger/car-trial">Car trial debugger</MenuItem>
      <MenuItem href="/debugger/terms">Terms viewer</MenuItem>
      <MenuItem href="/debugger/seb-leads">SEB Leads</MenuItem>
    </div>
  )
}

function MenuItem({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname?.startsWith(href)
  return (
    <ButtonNextLink
      variant={isActive ? 'secondary' : 'ghost'}
      size="medium"
      href={href}
      style={{ borderRadius: 0 }}
    >
      <Text>{children}</Text>
    </ButtonNextLink>
  )
}
