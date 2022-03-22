import styled from '@emotion/styled'

export type IconRootProps = {
  className?: string
  color?: string
  size?: string
  fontSize?: string
}

export const IconRoot = styled.svg<IconRootProps>((props) => ({
  width: props.size ? props.size : '1rem',
  height: props.size ? props.size : '1rem',
  fill: props.color ? props.color : 'currentColor',
  color: props.color ? props.color : 'currentColor',
  fontSize: props.fontSize ? props.fontSize : '1.5rem',
}))
