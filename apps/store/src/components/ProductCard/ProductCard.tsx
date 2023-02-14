import styled from '@emotion/styled'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Button, mq, Space, theme } from 'ui'
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
  link: string
} & ImageSize

export const ProductCard = ({
  title,
  subtitle,
  image: { alt = '', ...imageProps },
  aspectRatio,
  link,
}: ProductCardProps) => {
  const { t } = useTranslation('common')
  return (
    <Space y={0.25}>
      <Link href={link} legacyBehavior passHref>
        <ImageWrapper aspectRatio={aspectRatio} tabIndex={-1} aria-hidden={true}>
          <Image {...imageProps} alt={alt} fill sizes="100vw" />
        </ImageWrapper>
      </Link>
      <Link href={link}>
        <ContentWrapper>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
          <CallToAction>
            <Button size="medium" variant="secondary">
              {t('READ_MORE')}
            </Button>
          </CallToAction>
        </ContentWrapper>
      </Link>
    </Wrapper>
  )
}

const ImageWrapper = styled.a<ImageSize>(({ aspectRatio }) => ({
  display: 'block',
  position: 'relative',
  marginBottom: theme.space.md,
  ...(aspectRatio && { aspectRatio: aspectRatio }),

  '@supports not (aspect-ratio: auto)': {
    height: '0',
    paddingTop: 'calc((6/5 * 100%))',
    overflow: 'hidden',
  },

  ':hover, :active': {
    opacity: 0.95,
  },
}))

const Image = styled(NextImage)({
  objectFit: 'cover',
  borderRadius: theme.radius.md,

  [mq.md]: {
    borderRadius: theme.radius.lg,
  },
})

const ContentWrapper = styled.div({
  marginInline: theme.space.xs,
})

const Title = styled.p({
  fontSize: theme.fontSizes.md,
})

const Subtitle = styled.p({
  fontSize: theme.fontSizes.md,
  color: theme.colors.gray600,
})

const CallToAction = styled.div({
  display: 'flex',
  gap: theme.space.sm,
  marginTop: theme.space.lg,
})
