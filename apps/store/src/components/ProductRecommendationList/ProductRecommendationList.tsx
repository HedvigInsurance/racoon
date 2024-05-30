import { useTranslation } from 'next-i18next'
import { Heading, Space } from 'ui'
import type { ImageSize } from '@/blocks/ProductCardBlock'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import type { ProductRecommendationFragment } from '@/services/graphql/generated'
import { getStoryblokImageSize } from '@/services/storyblok/Storyblok.helpers'
import { productGrid } from '../ProductGrid/ProductGrid.css'

type Props = {
  recommendations: Array<ProductRecommendationFragment>
}

export const ProductRecommendationList = ({ recommendations }: Props) => {
  const { t } = useTranslation('cart')

  return (
    <Space y={{ base: 1.5, md: 3 }}>
      <Heading as="h2" variant="standard.24" align="center">
        {t('RECOMMENDATIONS_HEADING')}
      </Heading>

      <div className={productGrid}>
        {recommendations.map((item) => (
          <FeaturedProduct key={item.id} recommendation={item} />
        ))}
      </div>
    </Space>
  )
}

const FALLBACK_IMAGE = 'https://a.storyblok.com/f/165473/330x396/573a75c77d/home-low.png'

type FeaturedProductProps = {
  recommendation: ProductRecommendationFragment
}

const FeaturedProduct = ({ recommendation }: FeaturedProductProps) => {
  const imageSrc = recommendation.featuredImage?.src ?? FALLBACK_IMAGE
  const imageSize = getStoryblokImageSize(imageSrc)
  const aspectRatio = imageSize ? calculateAspectRatio(imageSize) : undefined

  return (
    <ProductCard
      key={recommendation.id}
      title={recommendation.displayNameShort}
      subtitle={recommendation.displayNameFull}
      image={{ src: imageSrc, alt: recommendation.featuredImage?.alt ?? '' }}
      aspectRatio={aspectRatio}
      link={{ url: recommendation.pageLink, type: 'product' }}
    />
  )
}

type CalculateAspectRatioParams = {
  width: number
  height: number
}

const calculateAspectRatio = ({
  width,
  height,
}: CalculateAspectRatioParams): ImageSize['aspectRatio'] => {
  // TODO: properly evaluate aspect ratio
  return `${width} / ${height}` as ImageSize['aspectRatio']
}
