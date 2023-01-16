import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { Space, theme, UIColors } from 'ui'
import { FontSizeProps, getFontSize } from '../../lib/fontSizes'

type TextColor = Pick<
  UIColors,
  'textPrimary' | 'textSecondary' | 'textTertiary' | 'textDisabled' | 'textNegative'
>

export type TextProps = {
  as?: 'p' | 'span' | 'div'
  align?: 'center' | 'left' | 'right'
  color?: keyof TextColor
  size?: FontSizeProps
  children?: ReactNode
  className?: string
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

export const Text = styled(
  Space,
  elementConfig,
)<TextProps>(({ align, color, size = 'md' }) => ({
  color: color ? theme.colors[color] : 'inherit',
  ...getFontSize(size),
  ...(align && { textAlign: align }),
}))
