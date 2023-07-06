import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { ReactNode } from 'react'
import Balancer from 'react-wrap-balancer'
import { FontSizeProps, getFontSize } from '../../lib/fontSizes'
import { UIColors } from '../../lib/theme/colors/colors'
import { theme } from '../../lib/theme/theme'
import { Space } from '../Space'

type TextColor = Pick<
  UIColors,
  | 'textPrimary'
  | 'textSecondary'
  | 'textSecondaryOnGray'
  | 'textTertiary'
  | 'textDisabled'
  | 'textNegative'
  | 'textGreen'
  | 'textAmber'
  | 'textRed'
>

export type TextProps = {
  as?: 'p' | 'span' | 'div'
  align?: 'center' | 'left' | 'right'
  balance?: boolean
  color?: keyof TextColor
  size?: FontSizeProps
  children?: ReactNode
  className?: string
  uppercase?: boolean
  strikethrough?: boolean
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

export const TextBase = styled(
  Space,
  elementConfig,
)<TextProps>(({ align, color, size = 'md', uppercase = false, strikethrough = false }) => ({
  color: color ? theme.colors[color] : 'inherit',
  ...getFontSize(size),
  ...(align && { textAlign: align }),
  ...(uppercase && { textTransform: 'uppercase' }),
  ...(strikethrough && { textDecorationLine: 'line-through' }),
}))

export const Text = ({ as, balance, children, className, ...rest }: TextProps) => (
  <TextBase as={as} className={className} {...rest}>
    {!balance ? children : <Balancer>{children}</Balancer>}
  </TextBase>
)
