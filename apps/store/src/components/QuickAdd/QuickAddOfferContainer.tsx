import { useTranslation } from 'next-i18next'
import { Heading, Text, yStack } from 'ui'
import type { CartFragment } from '@/services/graphql/generated'
import {
  type OfferRecommendationFragment,
  type ProductRecommendationFragment,
} from '@/services/graphql/generated'
import { ProductUsp } from './ProductUsp'
import { QuickAddEditableView } from './QuickAddEditableView'
import { useShowQuickAdd } from './useShowQuickAdd'

const ACCIDENT_INSURANCE = 'SE_ACCIDENT'

type Props = {
  shopSessionId: string
  cart: CartFragment
  offer: OfferRecommendationFragment
  product: ProductRecommendationFragment
}

export function QuickAddOfferContainer(props: Props) {
  const { t } = useTranslation('cart')
  const [show] = useShowQuickAdd()

  // We only support cross-selling of Accident insurance at the moment
  if (props.product.name !== ACCIDENT_INSURANCE) {
    console.log(`Cross sell | Unsupported product: ${props.product.name}`)
    return null
  }

  if (!show) return null

  return (
    <section className={yStack({ gap: 'lg' })}>
      <header>
        <Heading as="h2" variant="standard.18">
          {t('QUICK_ADD_BUNDLE_HEADER')}
        </Heading>
      </header>
      <QuickAddEditableView
        shopSessionId={props.shopSessionId}
        initialOffer={props.offer}
        pillow={props.product.pillowImage}
        title={props.product.displayNameFull}
        subtitle={t('USP_NO_BINDING_TIME')}
        productPageLink={props.product.pageLink}
        badge={t('QUICK_ADD_BADGE_LABEL')}
        Body={
          <div>
            <Text color="textSecondary">{t('ACCIDENT_OFFER_DESCRIPTION')}</Text>
            <ProductUsp>{t('ACCIDENT_OFFER_USP_1')}</ProductUsp>
            <ProductUsp>{t('ACCIDENT_OFFER_USP_2')}</ProductUsp>
            <ProductUsp>{t('ACCIDENT_OFFER_USP_3')}</ProductUsp>
          </div>
        }
      />
    </section>
  )
}
