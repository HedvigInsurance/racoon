import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { ReactNode } from 'react'
import Balancer from 'react-wrap-balancer'
import { Space, theme, UIColors } from 'ui'
import { FontSizeProps, getFontSize } from '../../lib/fontSizes'

type TextColor = Pick<
  UIColors,
  | 'textPrimary'
  | 'textSecondary'
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
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

export const TextBase = styled(
  Space,
  elementConfig,
)<TextProps>(({ align, color, size = 'md' }) => ({
  color: color ? theme.colors[color] : 'inherit',
  ...getFontSize(size),
  ...(align && { textAlign: align }),
}))

export const Text = ({ as, balance, children, className, ...rest }: TextProps) => (
  <TextBase as={as} className={className} {...rest}>
    {!balance ? children : <Balancer>{children}</Balancer>}
  </TextBase>
)
