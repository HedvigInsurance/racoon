import { UrlObject } from 'url'
import styled from '@emotion/styled'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { mq, Space, theme } from 'ui'
import { ImageSize } from '@/blocks/ProductCardBlock'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'

type ImageProps = {
  src: string
  alt?: string
  blurDataURL?: string
  objectPosition?: string
}

type LinkHref = string | UrlObject

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
  const priceLink = getPriceLink(link)

  return (
    <Space y={1.5}>
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
        {priceLink && (
          <ButtonNextLink href={priceLink} size="medium" variant="primary-alt">
            {t('GET_PRICE_LINK')}
          </ButtonNextLink>
        )}
      </CallToAction>
    </Space>
  )
}

const getPriceLink = (productLink: string): LinkHref | undefined => {
  if (productLink.includes('?')) {
    console.warn(
      "Product link has unexpected parameters, skipping price link generation.  Let's support it when we need it",
    )
    return
  }
  return {
    pathname: productLink,
    query: { [OPEN_PRICE_CALCULATOR_QUERY_PARAM]: 1 },
  } as const
}

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
