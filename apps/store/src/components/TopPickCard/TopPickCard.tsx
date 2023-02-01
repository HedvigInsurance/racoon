import styled from '@emotion/styled'
import { default as NextImage } from 'next/image'
import { Space, theme } from 'ui'

const PRODUCT_CARD_IMAGE_WIDTH_SMALL = '20.43rem'
const PRODUCT_CARD_IMAGE_HEIGHT_SMALL = '25rem'

type ImageProps = {
  src: string
  alt?: string
  blurDataURL?: string
  objectPosition?: string
}

export type TopPickCardProps = {
  title: string
  subtitle: string
  image: ImageProps
}

export const TopPickCard = ({
  title,
  subtitle,
  image: { alt = '', ...imageProps },
}: TopPickCardProps) => {
  return (
    <Wrapper y={0.25}>
      <ImageWrapper>
        <Image {...imageProps} alt={alt} fill sizes="100vw" />
      </ImageWrapper>
      <Space y={0.125}>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  height: '100%',
  width: PRODUCT_CARD_IMAGE_WIDTH_SMALL,
})

const ImageWrapper = styled.div(() => ({
  position: 'relative',
  height: PRODUCT_CARD_IMAGE_HEIGHT_SMALL,
  width: '100%',
}))

const Image = styled(NextImage)({
  objectFit: 'cover',
})

const Title = styled.h1({
  fontSize: theme.fontSizes.sm,
})

const Subtitle = styled.p({
  fontSize: theme.fontSizes.xs,
  color: theme.colors.gray600,
})
