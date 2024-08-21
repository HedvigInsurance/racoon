import clsx from 'clsx'
import Image from 'next/image'
import { memo } from 'react'
import { getImgSrc } from '@/services/storyblok/Storyblok.helpers'
import { pillowVariants } from './Pillow.css'

type PillowProps = {
  size: 'mini' | 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'
  src?: string
  alt?: string | null
  priority?: boolean
  className?: string
}

export const Pillow = memo(({ alt, src, priority, className, size, ...props }: PillowProps) => {
  if (!src) return <FallbackPillow {...props} size={size} />
  return (
    <Image
      {...props}
      className={clsx(pillowVariants(size), className)}
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

const FallbackPillow = ({ size, className, ...props }: PillowProps) => {
  return (
    <svg
      {...props}
      className={clsx(pillowVariants(size), className)}
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
