'use client'

import { Global } from '@emotion/react'
import { DarkmodeProvider, useMediaQuery } from '@hedvig-ui'
import { GlobalStyles } from '@hedvig-ui/themes'
import {
  Sidebar,
  SidebarLayout,
  SidebarLayoutContent,
  SidebarLayoutMain,
} from '@hope/common/components/layouts/SidebarLayout'
import { MobileTopBar } from '@hope/features/navigation/topbar/MobileTopBar'
import { TopBar } from '@hope/features/navigation/topbar/TopBar'
import { UsersProvider } from '@hope/features/user/hooks/use-users'
import { ApolloProvider } from 'app/components/providers/ApolloProvider'
import AuthProvider from 'app/components/providers/AuthProvider'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { MSWProvider } from './providers/MSWProvider'

export default function RootLayout({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 800px)')

  const isAuthRoute = pathname.startsWith('/login')

  if (isAuthRoute) {
    // Auth routes have no UI and `ApolloProvider` causes an infinite redirect to `login/logout`
    // since it keeps redirecting to the logout link before the route is loaded.
    return children
  }

  return (
    <MSWProvider>
      <ApolloProvider>
        <AuthProvider>
          <UsersProvider>
            <Global styles={GlobalStyles} />
            <DarkmodeProvider>
              <SidebarLayout>
                {!isMobile && <Sidebar />}
                <SidebarLayoutMain dark={pathname.startsWith('/login')}>
                  {isMobile ? <MobileTopBar /> : <TopBar />}
                  <SidebarLayoutContent>{children}</SidebarLayoutContent>
                </SidebarLayoutMain>
              </SidebarLayout>
            </DarkmodeProvider>
          </UsersProvider>
        </AuthProvider>
      </ApolloProvider>
    </MSWProvider>
  )
}
