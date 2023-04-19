import styled from '@emotion/styled'
import Image from 'next/image'

type PillowProps = {
  size?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'
  src?: string
  alt?: string | null
}

export const Pillow = ({ alt, src, ...props }: PillowProps) => {
  if (!src) return <FallbackPillow size={props.size} />
  return (
    <StyledImage {...props} src={src} alt={alt ?? ''} width={208} height={208} decoding="sync" />
  )
}

const StyledImage = styled(Image)<PillowProps>(({ size = 'medium' }) => getSize(size))

const FallbackPillow = ({ size }: Pick<PillowProps, 'size'>) => {
  return (
    <svg {...getSize(size)} viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.79613e-05 240C2.56137e-05 428.992 101.382 480 240.298 480C379.214 480 480 432.012 480 240C480 47.9875 396.228 -5.43757e-05 240.298 -4.198e-05C84.3668 -6.01019e-05 5.03089e-05 51.0075 3.79613e-05 240Z"
        fill="#F5F5F5"
      />
    </svg>
  )
}

const getSize = (size: PillowProps['size']) => {
  switch (size) {
    case 'xxsmall':
      return { width: '1.75rem', height: '1.75rem' }
    case 'xsmall':
      return { width: '2.25rem', height: '2.25rem' }
    case 'small':
      return { width: '3rem', height: '3rem' }
    case 'medium':
      return { width: '3.5rem', height: '3.5rem' }
    case 'large':
      return { width: '5rem', height: '5rem' }
    case 'xlarge':
      return { width: '6rem', height: '6rem' }
    case 'xxlarge':
      return { width: '13rem', height: '13rem' }
  }
}
