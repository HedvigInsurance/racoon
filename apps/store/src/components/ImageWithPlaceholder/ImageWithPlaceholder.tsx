import { clsx } from 'clsx'
import type { ImageProps } from 'next/image'
import { default as NextImage } from 'next/image'
import type { SyntheticEvent } from 'react'
import { useState } from 'react'
import { DEFAULT_IMAGE_QUALITY } from 'ui'
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
