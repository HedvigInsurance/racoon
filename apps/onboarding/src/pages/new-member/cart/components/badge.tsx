import React, { ReactNode } from 'react'

import styled from '@emotion/styled'

export type BadgeProps = {
  children: ReactNode
  className?: string
}

export const BadgeContainer = styled.span(({ theme }) => ({
  display: 'inline-block',
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  fontSize: '0.75rem',
  lineHeight: '2',
  textTransform: 'uppercase',
  textAlign: 'center',
  color: theme.colors.gray900,
  backgroundColor: theme.colors.purple300,
  borderRadius: '0.25rem',
}))

export const Badge = ({
  children,
  className,
}: BadgeProps)  => (
  <BadgeContainer className={className}>
    {children}
  </BadgeContainer>
)
