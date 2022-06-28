import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { TopMenu } from '../TopMenu/TopMenu'

const Wrapper = styled.main({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

type LayoutWithMenuProps = {
  children: ReactNode
}

export const LayoutWithMenu = ({ children }: LayoutWithMenuProps) => {
  return (
    <Wrapper>
      <TopMenu />
      {children}
    </Wrapper>
  )
}
