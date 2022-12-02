import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { ReactNode } from 'react'
import type { UIColor } from 'ui'

const FONT_SIZE_MAP = { s: 1, m: 2, l: 3, xl: 4, xxl: 5 }
type FontSize = keyof typeof FONT_SIZE_MAP

type TypographyProps = {
  as?: 'p' | 'span'
  align?: 'center' | 'left' | 'right'
  color?: UIColor
  size: FontSize
  children: ReactNode
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

const TextElement = styled(
  'span',
  elementConfig,
)<TypographyProps>(({ theme, align, color, size }) => ({
  color: color ? theme.colors[color] : 'inherit',
  fontSize: theme.fontSizes[FONT_SIZE_MAP[size]],
  ...(align && { textAlign: align }),
}))

export const Text = ({ as = 'p', align, color, size = 'm', children }: TypographyProps) => {
  return (
    <TextElement as={as} align={align} color={color} size={size}>
      {children}
    </TextElement>
  )
}
