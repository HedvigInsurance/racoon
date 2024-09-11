import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { yStack } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import {
  useProductRecommendationsQuery,
  type RecommendationFragment,
} from '@/services/graphql/generated'
import { useShopSessionId } from '@/services/shopSession/ShopSessionContext'
import { Features } from '@/utils/Features'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { actions } from './BonusOfferPresenter.css'
import { ProductCardSmall } from './ProductCardSmall'

export function BonusOfferPresenter() {
  const { t } = useTranslation('cart')
  const locale = useRoutingLocale()
  const router = useRouter()
  const { loading, recommendations } = useProductRecommendations()

  if (loading) {
    return <Skeleton style={{ height: '75vh' }} />
  }

  // This is just a safety mesure as we should not end here
  if (recommendations.length === 0) {
    console.log('PricaCalculator | No recommendations found. Rediecting to checkout')
    router.push(PageLink.checkout({ locale }).href)
  }

  return (
    <div className={yStack({ gap: 'xl' })}>
      <div className={yStack({ gap: 'md' })}>
        {recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.product.id} recommendation={recommendation} />
        ))}
        <ButtonNextLink href={PageLink.checkout({ locale })}>{t('CHECKOUT_BUTTON')}</ButtonNextLink>
      </div>
    </div>
  )
}

function RecommendationCard({ recommendation }: { recommendation: RecommendationFragment }) {
  const { t } = useTranslation()

  return (
    <ProductCardSmall
      productName={recommendation.product.displayNameFull}
      subtitle={recommendation.product.tagline}
      pillowImageSrc={recommendation.product.pillowImage.src}
    >
      <div className={actions}>
        <ButtonNextLink href={recommendation.product.pageLink} variant="secondary" size="medium">
          {t('READ_MORE')}
        </ButtonNextLink>
        {Features.enabled('PRICE_CALCULATOR_PAGE') &&
          recommendation.product.priceCalculatorPageLink && (
            <ButtonNextLink
              href={recommendation.product.priceCalculatorPageLink}
              variant="primary"
              size="medium"
            >
              {t('GET_PRICE_LINK')}
            </ButtonNextLink>
          )}
      </div>
    </ProductCardSmall>
  )
}

function useProductRecommendations() {
  const shopSessionId = useShopSessionId()

  const { loading, data } = useProductRecommendationsQuery({
    variables: shopSessionId ? { shopSessionId } : undefined,
    skip: shopSessionId == null,
  })

  const recommendations = useMemo(() => {
    return (
      data?.shopSession.recommendations.map<RecommendationFragment>(({ offer, product }) => ({
        offer: offer ?? undefined,
        product,
      })) ?? []
    )
  }, [data])

  return { loading, recommendations }
}
