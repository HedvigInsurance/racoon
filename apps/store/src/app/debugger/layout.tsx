import { type ReactNode } from 'react'
import { LogoHomeLink } from '@/appComponents/LogoHomeLink/LogoHomeLink'
import { RootLayout } from '@/appComponents/RootLayout/RootLayout'
import { header } from './layout.css'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <RootLayout>
      <div className={header}>
        <LogoHomeLink />
      </div>

      {children}
    </RootLayout>
  )
}

export const metadata = {
  robots: 'noindex, nofollow',
}

export default Layout
