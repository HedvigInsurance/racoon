import clsx from 'clsx'
import Image from 'next/image'
import { type ComponentProps, memo } from 'react'
import { BasePillow, type PillowSizeProp, pillowSizeStyles } from 'ui'
import { getImgSrc } from '@/services/storyblok/Storyblok.helpers'

type Props = {
  size: PillowSizeProp
  src?: string
  alt?: string | null
} & Omit<ComponentProps<typeof Image>, 'src' | 'alt'>

export const Pillow = memo(({ className, src, alt, size, ...props }: Props) => {
  if (!src) {
    return <BasePillow className={className} size={size} />
  }

  return (
    <Image
      className={clsx(pillowSizeStyles(size), className)}
      src={getImgSrc(src)}
      alt={alt ?? ''}
      width={208}
      height={208}
      decoding="sync"
      quality={70}
      {...props}
    />
  )
})
Pillow.displayName = 'Pillow'
