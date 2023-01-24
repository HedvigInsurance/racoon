import styled from '@emotion/styled'
import { default as NextImage } from 'next/image'
import { mq, Space, theme } from 'ui'
import { ImageSize } from '@/blocks/ProductCardBlock'

type ImageProps = {
  src: string
  alt?: string
  blurDataURL?: string
  objectPosition?: string
}

export type ProductCardProps = {
  title: string
  subtitle: string
  image: ImageProps
} & ImageSize

export const ProductCard = ({
  title,
  subtitle,
  image: { alt = '', ...imageProps },
  aspectRatio,
}: ProductCardProps) => {
  return (
    <Wrapper y={0.25}>
      <ImageWrapper aspectRatio={aspectRatio}>
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
})

const ImageWrapper = styled.div<ImageSize>(({ aspectRatio }) => ({
  position: 'relative',
  ...(aspectRatio && { aspectRatio: aspectRatio }),

  '@supports not (aspect-ratio: auto)': {
    height: '0',
    paddingTop: 'calc((6/5 * 100%))',
    overflow: 'hidden',
  },
}))

const Image = styled(NextImage)({
  objectFit: 'cover',
  borderRadius: theme.radius.md,

  [mq.md]: {
    borderRadius: theme.radius.lg,
  },
})

const Title = styled.p(({ theme }) => ({
  fontSize: theme.fontSizes.md,
}))

const Subtitle = styled.p(({ theme }) => ({
  fontSize: theme.fontSizes.md,
  color: theme.colors.gray600,
}))
