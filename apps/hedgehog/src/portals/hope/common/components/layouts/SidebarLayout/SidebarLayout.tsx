'use client'

import { createContext, PropsWithChildren, useContext, useState } from 'react'
import * as React from 'react'
import { BaseStyle, Flex, useInsecurePersistentState } from '@hedvig-ui'
import styled from '@emotion/styled'

interface SidebarLayoutContextProps {
  collapsed: boolean
  temporaryView: boolean
  toggle: () => void
  setTemporaryView: React.Dispatch<React.SetStateAction<boolean>>
}

export const SidebarLayoutContext = createContext<SidebarLayoutContextProps>({
  collapsed: false,
  temporaryView: false,
  toggle: () => void 0,
  setTemporaryView: () => void 0,
})

const Layout = styled(BaseStyle)`
  display: flex;
  height: 100vh;
`

export const SidebarLayoutBody = styled(Flex)`
  height: 100vh;
  width: 100%;
  overflow-y: hidden;
`

export const useSidebarLayout = () => useContext(SidebarLayoutContext)

export const SidebarLayout = ({ children }: PropsWithChildren) => {
  const [temporaryView, setTemporaryView] = useState(false)
  const [collapsed, setCollapsed] = useInsecurePersistentState<boolean>(
    'sidebar:collapsed',
    true,
  )

  return (
    <SidebarLayoutContext.Provider
      value={{
        collapsed,
        temporaryView,
        setTemporaryView,
        toggle: () => setCollapsed((current) => !current),
      }}
    >
      <Layout>
        <SidebarLayoutBody>{children}</SidebarLayoutBody>
      </Layout>
    </SidebarLayoutContext.Provider>
  )
}
