import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Heading, mq, Space, theme } from 'ui'
import { ImageSize } from '@/blocks/ProductCardBlock'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import { ProductRecommendationFragment } from '@/services/graphql/generated'
import { getStoryblokImageSize } from '@/services/storyblok/Storyblok.helpers'

type Props = {
  recommendations: Array<ProductRecommendationFragment>
}

export const ProductRecommendationList = ({ recommendations }: Props) => {
  const { t } = useTranslation('cart')

  return (
    <Wrapper y={{ base: 1.5, md: 3 }}>
      <Heading as="h2" variant="standard.24" align="center">
        {t('RECOMMENDATIONS_HEADING')}
      </Heading>

      <List>
        {recommendations.map((item) => (
          <FeaturedProduct key={item.id} recommendation={item} />
        ))}
      </List>
    </Wrapper>
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

const Wrapper = styled(Space)({
  paddingInline: theme.space.xs,
  [mq.lg]: { paddingInline: theme.space.lg },
})

// TODO: reuse styles as product grid
const List = styled.div({
  display: 'grid',
  rowGap: theme.space.xxxl,
  columnGap: theme.space.xs,
  alignItems: 'end',
  gridTemplateColumns: `repeat(auto-fit, minmax(20rem, 1fr))`,

  [mq.md]: {
    rowGap: theme.space.xl,
    columnGap: theme.space.md,
  },
})
