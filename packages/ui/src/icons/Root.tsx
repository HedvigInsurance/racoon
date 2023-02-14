import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

export type IconRootProps = {
  className?: string
  color?: string
  size?: string
  transform?: string
}

const elementConfig = {
  shouldForwardProp: (prop: string) => isPropValid(prop) && prop !== 'width' && prop !== 'height',
}
export const IconRoot = styled(
  'svg',
  elementConfig,
)<IconRootProps>(({ size, color, transform }) => ({
  width: size ? size : '1rem',
  height: size ? size : '1rem',
  fill: color ? color : 'currentColor',
  color: color ? color : 'currentColor',

  transform,
  transition: transform ? 'transform 250ms' : undefined,
}))
