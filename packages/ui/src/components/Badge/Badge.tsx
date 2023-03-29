import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { getMargins, Margins } from '../../lib/margins'
import { UIColors } from '../../lib/theme/colors/colors'
import { getColor, theme } from '../../lib/theme/theme'
import { BadgeSizeProps, getBadgeSize } from './Badge.helper'

type BadgeColors = Pick<UIColors, 'blueFill1' | 'blueFill2' | 'green50'>

export type BadgeProps = Margins & {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
  color?: keyof BadgeColors
  children: React.ReactNode
  size?: BadgeSizeProps
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

type BadgeBaseProps = Pick<BadgeProps, 'color' | 'size'> & Margins

export const BadgeBase = styled(
  'div',
  elementConfig,
)<BadgeBaseProps>(({ color, size, ...props }) => {
  color = color || 'blueFill1'
  size = size || 'sm'
  return {
    display: 'inline-block',
    color: theme.colors.dark,
    backgroundColor: getColor(color),
    borderRadius: theme.radius.xs,
    ...getBadgeSize(size),
    ...getMargins(props),
  }
})

export const Badge = ({ as, children, color, ...rest }: BadgeProps) => (
  <BadgeBase as={as} color={color} {...rest}>
    {children}
  </BadgeBase>
)
