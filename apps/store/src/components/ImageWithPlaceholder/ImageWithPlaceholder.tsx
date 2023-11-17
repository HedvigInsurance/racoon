import styled from '@emotion/styled'
import { default as NextImage, ImageProps } from 'next/image'
import { useState } from 'react'
import { theme, DEFAULT_IMAGE_QUALITY } from 'ui'

export const ImageWithPlaceholder = ({ ...props }: ImageProps) => {
  const [hasLoaded, setHasLoaded] = useState(false)

  const hasLoadedHandler = () => {
    setHasLoaded(true)
  }

  const imageProps = {
    quality: DEFAULT_IMAGE_QUALITY,
    ...props,
    ...(hasLoaded && { 'data-loaded': true }),
  } as const

  return <StyledImage {...imageProps} onLoadingComplete={hasLoadedHandler} />
}

const StyledImage = styled(NextImage)({
  backgroundColor: theme.colors.gray100,
  '&[data-loaded]': { backgroundColor: 'transparent' },
})
