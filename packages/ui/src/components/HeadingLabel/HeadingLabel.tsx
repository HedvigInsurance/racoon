import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

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
  padding: `${theme.space[2]} ${theme.space[3]}`,
  fontSize: theme.fontSizes[1],
  color: theme.colors.dark,
  // TODO: use colors from theme once defined
  backgroundColor: color ?? '#E0F0F9',
  borderRadius: theme.radius.xs,
}))

export const HeadingLabel = ({ as, children, color }: HeadingLabelProps) => (
  <LabelBase as={as} color={color}>
    {children}
  </LabelBase>
)
