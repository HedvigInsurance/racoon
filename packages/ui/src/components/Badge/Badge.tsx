import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { getMargins, Margins } from '../../lib/margins'
import { UIColors } from '../../lib/theme/colors/colors'
import { getColor, theme } from '../../lib/theme/theme'

type BadgeColors = Pick<UIColors, 'blueFill1' | 'blueFill2' | 'green50'>

export type BadgeProps = Margins & {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
  color?: keyof BadgeColors
  children: React.ReactNode
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

type BadgeBaseProps = Pick<BadgeProps, 'color'> & Margins

export const BadgeBase = styled(
  'div',
  elementConfig,
)<BadgeBaseProps>(({ color, ...props }) => {
  color = color || 'blueFill1'
  return {
    display: 'inline-block',
    paddingBlock: theme.space.xs,
    paddingInline: theme.space.sm,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.dark,
    backgroundColor: getColor(color),
    borderRadius: theme.radius.xs,
    ...getMargins(props),
  }
})

export const Badge = ({ as, children, color, ...rest }: BadgeProps) => (
  <BadgeBase as={as} color={color} {...rest}>
    {children}
  </BadgeBase>
)
