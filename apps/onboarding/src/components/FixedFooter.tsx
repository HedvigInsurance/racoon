import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'

export const FIXED_FOOTER_HEIGHT = '5rem'

const FixedContainer = styled.div((props) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: props.theme.colors.white,
  boxShadow: '0px -1px 10px rgba(0, 0, 0, 0.1)',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: FIXED_FOOTER_HEIGHT,
  padding: '0 1rem',
}))

export const FixedFooter = ({ children }: PropsWithChildren<{}>) => {
  return <FixedContainer>{children}</FixedContainer>
}

FixedFooter.HEIGHT = FIXED_FOOTER_HEIGHT
