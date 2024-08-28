import { ReactNode } from 'react'
import type { Metadata } from 'next'

// TODO: Move to vanilla-extract
import './global.css'
import RootLayout from './components/RootLayout'

const shouldRunMockServer =
  process.env.NEXT_RUNTIME === 'nodejs' &&
  process.env.NEXT_PUBLIC_MOCK_ENABLED === 'true'

if (shouldRunMockServer) {
  console.log('SERVER LISTEN')

  const { server } = require('../mocks/node')
  server.listen()
}

export const metadata: Metadata = {
  title: 'Hope',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.png',
      sizes: 'any',
    },
  ],
}

export default function AppSkeletonLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <RootLayout>{children}</RootLayout>
        <div id="portal-root"></div>
      </body>
    </html>
  )
}

export const dynamic = 'force-dynamic'
