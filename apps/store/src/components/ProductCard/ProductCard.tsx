import { UrlObject } from 'url'
import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Space, theme, mq } from 'ui'
import { ImageSize } from '@/blocks/ProductCardBlock'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
import { useProductMetadata } from '@/components/LayoutWithMenu/ProductMetadataContext'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { SelectInsuranceGrid } from '@/components/SelectInsuranceGrid/SelectInsuranceGrid'
import { getParameterizedLink } from '@/utils/getParameterizedLink'

type ImageProps = {
  src: string
  alt?: string
  blurDataURL?: string
  objectPosition?: string
}

type LinkHref = string | UrlObject

export type LinkType = 'product' | 'category'

export type ProductCardProps = {
  title: string
  subtitle: string
  image: ImageProps
  link: { url: string; type: LinkType }
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
            id="read-more-btn"
            onClick={() => router.push(link.url)}
            tabIndex={-1}
            aria-hidden={true}
            size="medium"
            variant="secondary"
          >
            {t('READ_MORE')}
          </Button>
          {link.type === 'product' && <ProductCTA link={link} />}
          {link.type === 'category' && <CategoryCTA link={link} />}
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

const ProductCTA = ({ link }: Pick<ProductCardProps, 'link'>) => {
  const { t } = useTranslation('common')

  const priceLink = getPriceLink(link.url)
  if (!priceLink) {
    datadogLogs.logger.warn('[ProductCard]: Unable to generate a price link. Skipping cta render!')
    return null
  }

  return (
    <ButtonNextLink href={priceLink} size="medium" variant="primary-alt">
      {t('GET_PRICE_LINK')}
    </ButtonNextLink>
  )
}

const CategoryCTA = ({ link }: Pick<ProductCardProps, 'link'>) => {
  const [isOpen, setIsOpen] = useState(false)
  const products = useProductMetadata()
  const { t } = useTranslation('common')

  const productsByCategory = (products ?? [])
    .filter((product) => product.categoryPageLink === link.url)
    .map((product) => ({
      ...product,
      pageLink: getParameterizedLink(product.pageLink, [[OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1']]),
    }))

  if (productsByCategory.length < 1) {
    datadogLogs.logger.warn(
      `[ProductCard]: No products category link ${link} were found. Skipping cta render!`,
    )
    return null
  }

  return (
    <FullscreenDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <FullscreenDialog.Trigger asChild>
        <Button variant="primary-alt" size="medium">
          {t('GET_PRICE_LINK')}
        </Button>
      </FullscreenDialog.Trigger>

      <FullscreenDialog.Modal>
        <AnimationWrapper
          initial={{ opacity: 0, y: '2vh' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ...theme.transitions.framer.easeInOutCubic }}
        >
          <StyledSelectInsuranceGrid
            products={productsByCategory}
            heading={t('SELECT_INSURANCE')}
          />
        </AnimationWrapper>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
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

  [`&:focus-visible ~ ${CallToAction} #read-more-btn`]: {
    boxShadow: `0 0 0 2px ${theme.colors.textPrimary}`,
  },
})

const AnimationWrapper = styled(motion.div)({
  width: '100%',
})

const StyledSelectInsuranceGrid = styled(SelectInsuranceGrid)({
  [mq.lg]: {
    paddingTop: '16vh',
  },

  [mq.xxl]: {
    paddingTop: '20vh',
  },
})
