import styled from '@emotion/styled'

export type IconRootProps = {
  className?: string
  color?: string
  size?: string
  transform?: string
}

export const IconRoot = styled.svg<IconRootProps>(({ size, color, transform }) => ({
  width: size ? size : '1rem',
  height: size ? size : '1rem',
  fill: color ? color : 'currentColor',
  color: color ? color : 'currentColor',

  transform,
  transition: transform ? 'transform 250ms' : undefined,
}))
