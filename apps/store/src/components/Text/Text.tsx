import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { ReactNode } from 'react'
import type { UIColor } from 'ui'

type FontSize = 's' | 'm' | 'l' | 'xl'

type TypographyProps = {
  size: FontSize
  color?: UIColor
  children: ReactNode
}

const fontSizeMap = { s: 1, m: 2, l: 3, xl: 4 }

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

const TextElement = styled(
  'span',
  elementConfig,
)<TypographyProps>(({ theme, color, size }) => ({
  color: color ? theme.colors[color] : 'inherit',
  fontSize: theme.fontSizes[fontSizeMap[size]],
}))

export const Text = ({ color, size = 'm', children }: TypographyProps) => {
  return (
    <TextElement color={color} size={size}>
      {children}
    </TextElement>
  )
}
