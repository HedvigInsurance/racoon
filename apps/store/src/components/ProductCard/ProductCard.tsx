import { UrlObject } from 'url'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { Button, mq, Space, theme } from 'ui'
import { ImageSize } from '@/blocks/ProductCardBlock'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
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
  link: { url: string; type: 'product' | 'content' }
} & ImageSize

export const ProductCard = ({
  title,
  subtitle,
  image: { alt = '', ...imageProps },
  aspectRatio,
  link,
}: ProductCardProps) => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const priceLink = link.type === 'product' ? getPriceLink(link.url) : undefined

  return (
    <Container y={1}>
      <ImageWrapper aspectRatio={aspectRatio}>
        <Image {...imageProps} alt={alt} fill sizes="100vw" />
      </ImageWrapper>
      <ContentWrapper>
        <MainLink href={link.url}>{title}</MainLink>
        <Subtitle>{subtitle}</Subtitle>
        <CallToAction>
          <Button
            onClick={() => router.push(link.url)}
            tabIndex={-1}
            aria-hidden={true}
            size="medium"
            variant="secondary"
          >
            {t('READ_MORE')}
          </Button>
          {priceLink && (
            <ButtonNextLink href={priceLink} size="medium" variant="primary-alt">
              {t('GET_PRICE_LINK')}
            </ButtonNextLink>
          )}
        </CallToAction>
      </ContentWrapper>
    </Container>
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

const CALL_TO_ACTION_HEIGHT = '2.5rem'

const Container = styled(Space)({
  position: 'relative',
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
    transition: `opacity ${theme.transitions.hover}`,
  },
}))

const Image = styled(ImageWithPlaceholder)({
  objectFit: 'cover',
  borderRadius: theme.radius.md,

  [mq.md]: {
    borderRadius: theme.radius.lg,
  },
})

const ContentWrapper = styled.div({
  marginInline: theme.space.xs,
})

const Subtitle = styled.p({
  fontSize: theme.fontSizes.md,
  color: theme.colors.gray600,
})

const CallToAction = styled.div({
  display: 'flex',
  height: CALL_TO_ACTION_HEIGHT,
  gap: theme.space.sm,
  marginTop: theme.space.lg,
})

const MainLink = styled(Link)({
  fontSize: theme.fontSizes.md,
  // Make the whole card clickable - CallToAction height
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: CALL_TO_ACTION_HEIGHT,
    left: 0,
  },

  [`&:focus-visible ~ ${CallToAction} button`]: {
    boxShadow: `0 0 0 2px ${theme.colors.textPrimary}`,
  },
})
