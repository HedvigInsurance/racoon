import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { getMargins, Margins } from '../../lib/margins'
import { UIColors } from '../../lib/theme/colors/colors'
import { getColor } from '../../lib/theme/theme'

type HeadingLabelColors = Pick<UIColors, 'blueFill1' | 'blueFill2'>

export type HeadingLabelProps = Margins & {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  color?: keyof HeadingLabelColors
  children: React.ReactNode
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

type HeadingLabelBaseProps = Pick<HeadingLabelProps, 'color'> & Margins

export const LabelBase = styled(
  'div',
  elementConfig,
)<HeadingLabelBaseProps>(({ color, theme, ...props }) => {
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

export const HeadingLabel = ({ as, children, color, ...rest }: HeadingLabelProps) => (
  <LabelBase as={as} color={color} {...rest}>
    {children}
  </LabelBase>
)
