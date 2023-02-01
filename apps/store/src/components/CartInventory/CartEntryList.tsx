import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { Separate, theme } from 'ui'

type Props = { children: ReactNode }

export const CartEntryList = ({ children }: Props) => {
  return (
    <StyledCartEntryList as="ul" Separator={<HorizontalLineWithSpace />}>
      {children}
    </StyledCartEntryList>
  )
}

const StyledCartEntryList = styled(Separate)({
  padding: 0,
  listStyleType: 'none',
  width: '100%',
})

const HorizontalLineWithSpace = styled.hr({
  backgroundColor: theme.colors.gray300,
  height: 1,
  marginTop: theme.space.lg,
  marginBottom: theme.space.lg,
})
