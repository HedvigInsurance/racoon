import { type ReactNode } from 'react'
import { LogoHomeLink } from '@/appComponents/LogoHomeLink/LogoHomeLink'
import { header } from './layout.css'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <div className={header}>
        <LogoHomeLink />
      </div>

      {children}
    </>
  )
}

export const metadata = {
  robots: 'noindex, nofollow',
}

export default Layout
