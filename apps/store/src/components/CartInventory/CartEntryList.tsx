import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { theme } from 'ui'

type Props = { children: ReactNode }

export const CartEntryList = ({ children }: Props) => {
  return <StyledCartEntryList>{children}</StyledCartEntryList>
}

const StyledCartEntryList = styled.ul({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,
  padding: 0,
  listStyleType: 'none',
  width: '100%',
})
