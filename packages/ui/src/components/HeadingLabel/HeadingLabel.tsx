import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { theme } from '../../lib/theme/theme'

export type HeadingLabelProps = {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  color?: string
  children: React.ReactNode
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'color',
}

export const LabelBase = styled(
  'div',
  elementConfig,
)<Pick<HeadingLabelProps, 'color'>>(({ color, theme }) => ({
  display: 'inline-block',
  paddingBlock: theme.space.xs,
  paddingInline: theme.space.sm,
  fontSize: theme.fontSizes.xs,
  color: theme.colors.dark,
  // TODO: Use theme color when we remove the old theme
  backgroundColor: color ?? '#E0F0F9',
  borderRadius: theme.radius.xs,
}))

export const HeadingLabel = ({
  as,
  children,
  color = theme.colors.blueFill1,
}: HeadingLabelProps) => (
  <LabelBase as={as} color={color}>
    {children}
  </LabelBase>
)
