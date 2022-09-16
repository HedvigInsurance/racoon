import styled from '@emotion/styled'

type PillowProps = {
  fromColor: string
  toColor: string
  size?: 'small' | 'medium' | 'large'
}

export const Pillow = styled.div<PillowProps>(({ fromColor, toColor, size = 'small' }) => ({
  height: getSize(size),
  width: getSize(size),
  background: `linear-gradient(180deg, ${fromColor} 0%, ${toColor} 100%)`,
  borderRadius: 12,
  backgroundClip: 'padding-box',
}))

const getSize = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return '3rem'
    case 'medium':
      return '3.5rem'
    case 'large':
      return '4rem'
  }
}
