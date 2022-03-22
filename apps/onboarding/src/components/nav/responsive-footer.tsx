import React from 'react'
import { mq } from 'ui'
import styled from '@emotion/styled'

export type StickyFooterProps = {
  children: React.ReactNode
}

const StickyContainer = styled.div((props) => ({
  position: 'sticky',
  bottom: 0,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: props.theme.colors.white,
  boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
  padding: '1rem',
  paddingBottom: '2rem',
  [mq.sm]: {
    position: 'static',
    backgroundColor: 'inherit',
    boxShadow: 'unset',
  },
}))

export const ResponsiveFooter = ({ children }: StickyFooterProps) => {
  return <StickyContainer>{children}</StickyContainer>
}
