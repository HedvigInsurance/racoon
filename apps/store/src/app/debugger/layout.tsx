import { type ReactNode } from 'react'
import { Spacer } from 'ui'
import { DebuggerMenu } from '@/appComponents/DebuggerMenu/DebuggerMenu'
import { RootLayout } from '@/appComponents/RootLayout/RootLayout'
import { Header } from '@/components/Header/Header'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <RootLayout>
      <Header>
        <DebuggerMenu />
      </Header>
      <Spacer />

      <main>{children}</main>
    </RootLayout>
  )
}

export const metadata = {
  robots: 'noindex, nofollow',
}

export default Layout
