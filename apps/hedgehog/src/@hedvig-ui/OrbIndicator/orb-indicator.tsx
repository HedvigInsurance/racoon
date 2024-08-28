import styled from '@emotion/styled'
import { HTMLAttributes } from 'react'
import * as React from 'react'
import { lightTheme } from '..'

export type FlagProp = 'GREEN' | 'AMBER' | 'RED'

interface OrbIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  color?: string
  size: string
  flag?: FlagProp
}

const OrbIndicatorStyled = styled.div<{ color: string; size?: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: ${({ color }) => color};
  border-radius: 50%;
`

export const OrbIndicator: React.FC<OrbIndicatorProps> = ({
  color,
  size,
  flag,
  ...props
}) => {
  const currentColor =
    !flag && color
      ? color
      : flag
        ? getFlagColor(flag)
        : lightTheme.placeholderColor

  return <OrbIndicatorStyled color={currentColor} size={size} {...props} />
}

const getFlagColor = (flag?: FlagProp | null) => {
  if (flag === 'AMBER') {
    return '#f2711c'
  }
  if (flag === 'RED') {
    return lightTheme.danger
  }

  return '#21ba45'
}
