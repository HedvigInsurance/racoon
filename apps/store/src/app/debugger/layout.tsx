import { type ReactNode } from 'react'
import { LogoHomeLink } from '@/appComponents/LogoHomeLink/LogoHomeLink'

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <div>
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
