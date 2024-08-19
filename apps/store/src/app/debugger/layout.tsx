import { type ReactNode } from 'react'
import { Heading, xStack } from 'ui'
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
        <Heading as="h1" variant="standard.24" style={{ flexGrow: 1 }}>
          Debug tools
        </Heading>
      </Header>
      <div className={xStack({ gap: 'md' })}>
        <DebuggerMenu />
        <main className={contentWrapper}>{children}</main>
      </div>
    </RootLayout>
  )
}

export const metadata = {
  robots: 'noindex, nofollow',
}

export default Layout
