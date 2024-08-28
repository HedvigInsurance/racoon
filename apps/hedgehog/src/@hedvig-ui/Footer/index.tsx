import { PropsWithChildren } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import { spacingMap } from '@hedvig-ui'
import { theme } from '@hedvig-ui/redesign/theme'

const Wrapper = styled.div<{
  sidebarCollapsed: boolean
  isInboxView: boolean
}>`
  transition: all 300ms !important;

  position: fixed;
  left: ${({ sidebarCollapsed }) =>
    sidebarCollapsed
      ? theme.sidebarWidth.collapsed
      : theme.sidebarWidth.expanded};
  bottom: 0;

  display: flex;
  align-items: center;
  gap: ${spacingMap.small};

  height: ${theme.footerHeight};

  width: ${({ isInboxView, sidebarCollapsed }) =>
    isInboxView
      ? `calc(100vw - var(--chat-width) ${!sidebarCollapsed ? ` - ${theme.sidebarWidth.expanded}` : ` - ${theme.sidebarWidth.collapsed}`})`
      : `calc(100vw ${!sidebarCollapsed ? ` - ${theme.sidebarWidth.expanded}` : ` - ${theme.sidebarWidth.collapsed}`})`};

  padding: 0 10px;
  background: ${({ theme }) => theme.backgroundLight};
  z-index: 100;
`

export const Footer: React.FC<
  PropsWithChildren & {
    sidebarCollapsed: boolean
    isInboxView: boolean
  }
> = ({ sidebarCollapsed, isInboxView, children }) => {
  return (
    <Wrapper isInboxView={isInboxView} sidebarCollapsed={sidebarCollapsed}>
      {children}
    </Wrapper>
  )
}
