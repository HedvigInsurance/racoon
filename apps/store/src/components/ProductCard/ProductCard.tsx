import styled from '@emotion/styled'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { mq, Space, theme } from 'ui'
import { ImageSize } from '@/blocks/ProductCardBlock'
import { ButtonNextLink } from '@/components/ButtonNextLink'

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
    <Wrapper y={1.5}>
      <Link href={link} tabIndex={-1} aria-hidden={true}>
        <ImageWrapper aspectRatio={aspectRatio}>
          <Image {...imageProps} alt={alt} fill sizes="100vw" />
        </ImageWrapper>
        <ContentWrapper>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </ContentWrapper>
      </Link>
      <CallToAction>
        <ButtonNextLink href={link} size="medium" variant="secondary">
          {t('READ_MORE')}
        </ButtonNextLink>
      </CallToAction>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  height: '100%',
})

const ImageWrapper = styled.div<ImageSize>(({ aspectRatio }) => ({
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
    transition: 'opacity 0.1s ease-out',
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
  marginInline: theme.space.xs,
})
