import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { ReactNode } from 'react'
import type { UIColors } from 'ui'
import { FontSizeProps, getFontSize } from '../../lib/fontSizes'

type TextColor = Pick<
  UIColors,
  'textPrimary' | 'textSecondary' | 'textTertiary' | 'textDisabled' | 'textNegative'
>

export type TextProps = {
  as?: 'p' | 'span'
  align?: 'center' | 'left' | 'right'
  color?: keyof TextColor
  size?: FontSizeProps
  children: ReactNode
  className?: string
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

const TextElement = styled(
  'span',
  elementConfig,
)<TextProps>(({ theme, align, color, size = 'md' }) => ({
  color: color ? theme.colors[color] : 'inherit',
  ...getFontSize(size),
  ...(align && { textAlign: align }),
}))

export const Text = ({ as = 'p', size, children, ...props }: TextProps) => {
  return (
    <TextElement as={as} size={size} {...props}>
      {children}
    </TextElement>
  )
}
