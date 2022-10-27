import styled from '@emotion/styled'

type PillowProps = {
  fromColor: string
  toColor: string
  size?: 'small' | 'medium' | 'large' | 'xlarge'
}

export const PillowShape = styled.div<PillowProps>(({ fromColor, toColor, size = 'medium' }) => ({
  height: getSize(size),
  width: getSize(size),
  background: `linear-gradient(116.75deg, ${fromColor} 0%, ${toColor} 100%)`,
  backgroundClip: 'padding-box',
  clipPath: 'url(#pillowClipPath)',
}))

export const Pillow = (props: PillowProps) => (
  <>
    <svg width="0" height="0">
      <clipPath id="pillowClipPath" clipPathUnits="objectBoundingBox">
        <path d="M0.794,0.986 a3,3,0,0,1,-0.588,0 a0.213,0.213,0,0,1,-0.192,-0.192 a3,3,0,0,1,0,-0.588 A0.213,0.213,0,0,1,0.206,0.014 a3,3,0,0,1,0.588,0 a0.213,0.213,0,0,1,0.192,0.192 a3,3,0,0,1,0,0.588 a0.213,0.213,0,0,1,-0.192,0.192"></path>
      </clipPath>
    </svg>
    <PillowShape {...props} />
  </>
)

const getSize = (size: 'small' | 'medium' | 'large' | 'xlarge') => {
  switch (size) {
    case 'small':
      return '3rem'
    case 'medium':
      return '3.5rem'
    case 'large':
      return '4rem'
    case 'xlarge':
      return '12.5rem'
  }
}
