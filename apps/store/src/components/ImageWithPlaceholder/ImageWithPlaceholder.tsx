import { clsx } from 'clsx'
import { default as NextImage, type ImageProps } from 'next/image'
import { type SyntheticEvent, useState } from 'react'
import { DEFAULT_IMAGE_QUALITY } from '@/utils/config'
import { imageStyles } from './ImageWithPlaceholder.css'

export const ImageWithPlaceholder = ({
  quality,
  className,
  onLoad,
  ...forwardedProps
}: ImageProps) => {
  const [hasLoaded, setHasLoaded] = useState(false)

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    setHasLoaded(true)
    onLoad?.(event)
  }

  return (
    <NextImage
      {...forwardedProps}
      quality={quality ?? DEFAULT_IMAGE_QUALITY}
      className={clsx(hasLoaded ? imageStyles.loaded : imageStyles.base, className)}
      onLoad={handleLoad}
    />
  )
}
