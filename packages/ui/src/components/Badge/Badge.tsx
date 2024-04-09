import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import type { Margins, UIColors } from '../../theme';
import { getColor, getMargins, theme } from '../../theme'
import type { BadgeSizeProps} from './Badge.helper';
import { getBadgeSize } from './Badge.helper'

type BadgeColors = Pick<
  UIColors,
  'blueFill1' | 'blueFill2' | 'blueFill3' | 'green50' | 'signalAmberHighlight'
>

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
  color = color ?? 'blueFill1'
  size = size ?? 'small'
  return {
    display: 'inline-block',
    color: theme.colors.dark,
    backgroundColor: getColor(color),
    borderRadius: theme.radius.xxs,
    ...getBadgeSize(size),
    ...getMargins(props),
  }
})

export const Badge = ({ as, children, color, ...rest }: BadgeProps) => (
  <BadgeBase as={as} color={color} {...rest}>
    {children}
  </BadgeBase>
)
