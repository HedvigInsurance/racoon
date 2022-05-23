import styled from '@emotion/styled'
import React from 'react'
import { mq } from 'ui'

export type StickyFooterProps = {
  children: React.ReactNode
}

const StickyContainer = styled.div((props) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: props.theme.colors.white,
  boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '5rem',
  padding: '0 1rem',
}))

export const StickyFooter = ({ children }: StickyFooterProps) => {
  return <StickyContainer>{children}</StickyContainer>
}
