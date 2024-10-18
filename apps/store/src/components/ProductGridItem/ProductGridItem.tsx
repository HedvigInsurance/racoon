import { assignInlineVars } from '@vanilla-extract/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { Button } from 'ui/src/components/Button/Button'
import { Text, sprinkles, breakpoints } from 'ui'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
import type { ImageSize } from '../../blocks/ProductGridItemBlock/ProductGridItemBlock'
import {
  card,
  image,
  imageAspectRatio,
  imageWrapper,
  cardLinks,
  readMoreLink,
  mainLink,
} from './ProductGridItem.css'
import { ProductGridItemBlockCategoryCTA } from './ProductGridItemCategoryCTA'
import { ProductGridItemBlockProductCTA } from './ProductGridItemProductCTA'

type ImageProps = {
  src: string
  alt?: string
  blurDataURL?: string
  objectPosition?: string
  priority?: boolean
}

export type LinkType = 'product' | 'category'

export type ProductGridItemProps = {
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
export const ProductGridItem = ({
  title,
  subtitle,
  image: { alt = '', ...imageProps },
  aspectRatio,
  link,
}: ProductGridItemProps) => {
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

          {link.type === 'product' && <ProductGridItemBlockProductCTA url={link.url} />}
          {link.type === 'category' && <ProductGridItemBlockCategoryCTA url={link.url} />}
        </div>
      </div>
    </div>
  )
}
