import styled from '@emotion/styled'
import ImageProps from 'next/image'
import { Space } from 'ui'

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
}

export const ProductCard = ({
  title,
  subtitle,
  image: { alt = '', ...imageProps },
}: ProductCardProps) => {
  return (
    <Wrapper y={0.25}>
      <ImageWrapper>
        <ImageProps {...imageProps} alt={alt} layout="fill" objectFit="cover" />
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

const ImageWrapper = styled.div(() => ({
  position: 'relative',
  aspectRatio: '5 / 6',

  '@supports not (aspect-ratio: auto)': {
    height: '0',
    paddingTop: 'calc((6/5 * 100%))',
    overflow: 'hidden',
  },
}))

const Title = styled.p(({ theme }) => ({
  fontSize: theme.fontSizes[2],
}))

const Subtitle = styled.p(({ theme }) => ({
  fontSize: theme.fontSizes[1],
  color: theme.colors.gray600,
}))
