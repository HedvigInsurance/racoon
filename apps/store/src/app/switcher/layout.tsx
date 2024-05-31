import { type ReactNode } from 'react'
import { RootLayout } from '@/appComponents/RootLayout/RootLayout'
import { Header } from '@/components/Header/Header'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <RootLayout>
      <Header />
      <main>{children}</main>
    </RootLayout>
  )
}

export const metadata = {
  robots: 'noindex, nofollow',
}

export default Layout
