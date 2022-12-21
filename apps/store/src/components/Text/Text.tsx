import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { ReactNode } from 'react'
import type { UIColorKeys } from 'ui'

const FONT_SIZE_MAP = { s: 1, m: 2, l: 3, xl: 4, xxl: 5 }
type FontSize = keyof typeof FONT_SIZE_MAP

type TypographyProps = {
  as?: 'p' | 'span'
  align?: 'center' | 'left' | 'right'
  color?: UIColorKeys
  size?: FontSize
  children: ReactNode
  className?: string
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

const TextElement = styled(
  'span',
  elementConfig,
)<TypographyProps>(({ theme, align, color, size = 'm' }) => ({
  color: color ? theme.colors[color] : 'inherit',
  fontSize: theme.fontSizes[FONT_SIZE_MAP[size]],
  ...(align && { textAlign: align }),
}))

export const Text = ({ as = 'p', size = 'm', children, ...props }: TypographyProps) => {
  return (
    <TextElement as={as} size={size} {...props}>
      {children}
    </TextElement>
  )
}
