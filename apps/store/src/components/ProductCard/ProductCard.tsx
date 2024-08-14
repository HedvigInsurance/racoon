import { assignInlineVars } from '@vanilla-extract/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Button, Text, sprinkles, visuallyHidden, breakpoints } from 'ui'
import type { ImageSize } from '@/blocks/ProductCardBlock'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { SelectInsuranceGrid } from '@/components/SelectInsuranceGrid/SelectInsuranceGrid'
import { Features } from '@/utils/Features'
import { isSameLink } from '@/utils/url'
import {
  card,
  image,
  imageAspectRatio,
  imageWrapper,
  cardLinks,
  selectInsuranceGrid,
  readMoreLink,
  mainLink,
} from './ProductCard.css'

type ImageProps = {
  src: string
  alt?: string
  blurDataURL?: string
  objectPosition?: string
  priority?: boolean
}

export type LinkType = 'product' | 'category'

export type ProductCardProps = {
  title: string
  subtitle: string
  image: ImageProps
  link: { url: string; type: LinkType }
} & ImageSize

/*
SEO and a11y notes
- We want full element to be clickable (UX), so main link is an absolutely positioned overlay that covers full card
  except bottom row
- We want keyboard focus to highlight "Read more" button (done with complex nested selector, see CSS part)
- Links cannot be nested, hence "Read more" is actually a button that navigated with 'onClick'
  to avoid duplicate hrefs (SEO). It also has negative tabindex to make sure keyboard navigation only sees
  main link and extra buttons
 */
export const ProductCard = ({
  title,
  subtitle,
  image: { alt = '', ...imageProps },
  aspectRatio,
  link,
}: ProductCardProps) => {
  const { t } = useTranslation('common')
  const router = useRouter()

  // Hand-picked to match grid styles on ProductGrid
  // Edge cases:
  // - single column on small screens
  // - 2-column grid with just 2 elements is displayed on wide monitor
  const imageSizes = `(max-width: ${breakpoints.sm}px) 100vw, 50vw`
  return (
    <div className={card}>
      <div className={imageWrapper} style={assignInlineVars({ [imageAspectRatio]: aspectRatio })}>
        <ImageWithPlaceholder
          className={image}
          {...imageProps}
          alt={alt}
          fill={true}
          sizes={imageSizes}
        />
      </div>
      <div className={sprinkles({ marginInline: 'xs' })}>
        <Link className={mainLink} href={link.url}>
          {title}
        </Link>
        <Text size="md" color="textSecondary">
          {subtitle}
        </Text>
        <div className={cardLinks}>
          <Button
            className={readMoreLink}
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
        </div>
      </div>
    </div>
  )
}

const ProductCTA = ({ link }: Pick<ProductCardProps, 'link'>) => {
  const { t } = useTranslation('common')

  const products = useProductMetadata()
  const product = products?.find((product) => isSameLink(product.pageLink, link.url))
  if (product == null) {
    console.warn(`Did not find product for link ${link.url}, skipping CTA render!`)
    return
  }

  let priceLink: { pathname: string; query?: Record<string, string> }
  if (Features.enabled('PRICE_CALCULATOR_PAGE') && product.priceCalculatorPageLink) {
    priceLink = { pathname: product.priceCalculatorPageLink }
  } else {
    priceLink = {
      pathname: product.pageLink,
      query: { [OPEN_PRICE_CALCULATOR_QUERY_PARAM]: '1' },
    }
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

  const productsByCategory = (products ?? []).filter(
    (product) => product.categoryPageLink && isSameLink(product.categoryPageLink, link.url),
  )

  if (productsByCategory.length < 1) {
    console.warn(
      `[ProductCard]: No products category link ${link.url} were found. Skipping cta render!`,
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
        <FullscreenDialog.Title className={visuallyHidden}>
          {t('SELECT_INSURANCE')}
        </FullscreenDialog.Title>
        <SelectInsuranceGrid
          products={productsByCategory}
          heading={t('SELECT_INSURANCE')}
          className={selectInsuranceGrid}
        />
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}
