import { type ReactNode } from 'react'
import { DebuggerMenu } from '@/app/debugger/DebuggerMenu'
import { RootLayout } from '@/appComponents/RootLayout/RootLayout'
import { Header } from '@/components/Header/Header'
import { contentWrapper } from './debugger.css'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <RootLayout>
      <Header>
        <DebuggerMenu />
      </Header>

      <main className={contentWrapper}>{children}</main>
    </RootLayout>
  )
}

export const metadata = {
  robots: 'noindex, nofollow',
}

export default Layout
