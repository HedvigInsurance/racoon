import styled from '@emotion/styled'
import Image from 'next/image'
import { DEFAULT_IMAGE_QUALITY, mq } from 'ui'
import { getImgSrc } from '@/services/storyblok/Storyblok.helpers'

type Props = {
  image: { src: string; alt: string }
}

export const ImageSection = ({ image }: Props) => {
  return (
    <Wrapper>
      <StyledImage
        src={getImgSrc(image.src)}
        alt={image.alt}
        fill={true}
        quality={DEFAULT_IMAGE_QUALITY}
      />
    </Wrapper>
  )
}

const Wrapper = styled.section({
  pointerEvents: 'none',

  position: 'relative',
  // Make the image appear like a background image
  zIndex: '-1',
  top: '-20vw',
  height: '100vw',

  [mq.sm]: {
    top: '-10vw',
    height: '71vw',
  },
})

const StyledImage = styled(Image)({
  objectFit: 'cover',
  objectPosition: 'center',
})