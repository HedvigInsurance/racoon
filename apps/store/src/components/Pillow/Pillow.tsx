import styled from '@emotion/styled'

type PillowProps = {
  fromColor: string
  toColor: string
  size?: 'small' | 'medium' | 'large'
}

export const Pillow = styled.div<PillowProps>(({ fromColor, toColor, size = 'medium' }) => ({
  height: getSize(size),
  width: getSize(size),
  background: `linear-gradient(116.75deg, ${fromColor} 0%, ${toColor} 100%)`,
  backgroundClip: 'padding-box',
  clipPath: `path(
    'M44.458 55.22a173.915 173.915 0 0 1-32.919 0A11.924 11.924 0 0 1 .781 44.457a173.895 173.895 0 0 1 0-32.916A11.926 11.926 0 0 1 11.539.781a173.922 173.922 0 0 1 32.919 0 11.932 11.932 0 0 1 10.761 10.761 173.887 173.887 0 0 1 0 32.916 11.928 11.928 0 0 1-10.761 10.761Z'
  )`,
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
