import styled from '@emotion/styled'
import { ReactNode } from 'react'

type CollapsiblePros = {
  collapsed: boolean
  children: ReactNode
}

export const Collapsible = ({ collapsed, children }: CollapsiblePros) => (
  <StyledCollapsible collapsed={collapsed}>
    <div>{children}</div>
  </StyledCollapsible>
)

const StyledCollapsible = styled.div<{ collapsed: boolean }>`
  display: grid;
  grid-template-rows: ${({ collapsed }) => (collapsed ? '0fr' : '1fr')};
  transition: grid-template-rows 200ms ease-in-out;

  > div {
    overflow: hidden;
  }
`
