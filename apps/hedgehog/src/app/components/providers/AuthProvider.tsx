'use client'

import { MeProvider } from '@hope/features/user/hooks/use-me'
import { useAuthenticate } from 'auth/use-authenticate'
import { PropsWithChildren } from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {
  const { me } = useAuthenticate()

  if (!me) {
    return null
  }

  return <MeProvider me={me}>{children}</MeProvider>
}
