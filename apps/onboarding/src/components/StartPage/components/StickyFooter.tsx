import styled from '@emotion/styled'
import { mq } from 'ui'

const StyledFooter = styled.div(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.colors.white,
  boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.05), 0px -8px 16px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  justifyContent: 'stretch',

  [mq.lg]: {
    position: 'static',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
}))

const FooterContent = styled.div({
  width: '100%',
  maxWidth: '600px',
  margin: 'auto',
  padding: '1rem',
  paddingBottom: '2rem',

  [mq.lg]: {
    padding: 0,
  },
})

type Props = {
  children: React.ReactNode
}

export const StickyFooter = ({ children }: Props) => {
  return (
    <StyledFooter>
      <FooterContent>{children}</FooterContent>
    </StyledFooter>
  )
}
