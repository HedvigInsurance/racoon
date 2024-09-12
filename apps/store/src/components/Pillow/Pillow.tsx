import Image from 'next/image'
import { memo } from 'react'
import { BasePillow, type PillowProps } from 'ui'
import { getImgSrc } from '@/services/storyblok/Storyblok.helpers'

export const Pillow = memo(({ alt, src, ...props }: PillowProps) => {
  return (
    <BasePillow shouldFallback={!src} {...props}>
      <Image
        // Just to make TS happy, will fallback if `src` is unavailable
        src={getImgSrc(src!)}
        alt={alt ?? ''}
        width={208}
        height={208}
        decoding="sync"
        quality={70}
      />
    </BasePillow>
  )
})
Pillow.displayName = 'Pillow'
