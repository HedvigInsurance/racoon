import styled from '@emotion/styled'
import Image from 'next/image'
import { memo } from 'react'
import { getImgSrc } from '@/services/storyblok/Storyblok.helpers'

type PillowProps = {
  size?: 'mini' | 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'
  src?: string
  alt?: string | null
  priority?: boolean
  className?: string
}

export const Pillow = memo(({ alt, src, priority, ...props }: PillowProps) => {
  if (!src) return <FallbackPillow {...props} size={props.size} />
  return (
    <StyledImage
      {...props}
      src={getImgSrc(src)}
      alt={alt ?? ''}
      width={208}
      height={208}
      decoding="sync"
      priority={priority}
      quality={70}
    />
  )
})
Pillow.displayName = 'Pillow'

const StyledImage = styled(Image)<PillowProps>(({ size = 'medium' }) => getSize(size))

const FallbackPillow = ({ size, ...props }: Pick<PillowProps, 'size'>) => {
  return (
    <svg
      {...props}
      {...getSize(size)}
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.79613e-05 240C2.56137e-05 428.992 101.382 480 240.298 480C379.214 480 480 432.012 480 240C480 47.9875 396.228 -5.43757e-05 240.298 -4.198e-05C84.3668 -6.01019e-05 5.03089e-05 51.0075 3.79613e-05 240Z"
        fill="#F5F5F5"
      />
    </svg>
  )
}

const getSize = (size: PillowProps['size']) => {
  switch (size) {
    case 'mini':
      return { width: '1.5rem', height: '1.5rem' }
    case 'xxsmall':
      return { width: '1.75rem', height: '1.75rem' }
    case 'xsmall':
      return { width: '2rem', height: '2rem' }
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
