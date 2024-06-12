import { useTranslation } from 'next-i18next'
import type { ReactNode } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Button, Heading, Text } from 'ui'
import { Perils } from '@/components/Perils/Perils'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import type { CartFragmentFragment } from '@/services/graphql/generated'
import {
  type OfferRecommendationFragment,
  type ProductRecommendationFragment,
} from '@/services/graphql/generated'
import { Experiments } from '@/services/Tracking/experiment.constants'
import { getExperimentVariantByName } from '@/services/Tracking/experiment.helpers'
import { trackExperimentImpression } from '@/services/Tracking/trackExperimentImpression'
import { useTracking } from '@/services/Tracking/useTracking'
import { getOfferPrice } from '@/utils/getOfferPrice'
import { DismissButton } from './DismissButton'
import { ProductUsp } from './ProductUsp'
import { QuickAddBundleView } from './QuickAddBundleView'
import { QuickAddEditableView } from './QuickAddEditableView'
import { QuickAddInfoDialog } from './QuickAddInfoDialog'
import { quickAddSection } from './QuickAddOfferContainer.css'
import { useAddRecommendationOfferToCart } from './useAddRecommendationOfferToCart'
import { useShowQuickAdd } from './useShowQuickAdd'

const CO_INSURED_DATA_KEY = 'numberCoInsured'
const HOME_INSURANCES = [
  'SE_HOUSE',
  'SE_APARTMENT_RENT',
  'SE_APARTMENT_BRF',
  'SE_APARTMENT_STUDENT',
]
const ACCIDENT_INSURANCE = 'SE_ACCIDENT'

type Props = {
  shopSessionId: string
  cart: CartFragmentFragment
  offer: OfferRecommendationFragment
  product: ProductRecommendationFragment
}

export function QuickAddOfferContainer(props: Props) {
  const { t } = useTranslation('cart')
  const [show] = useShowQuickAdd()
  const tracking = useTracking()
  const [addOfferToCart, loading] = useAddRecommendationOfferToCart({
    shopSessionId: props.shopSessionId,
  })

  // We only support cross-selling of Accident insurance at the moment
  if (props.product.name !== ACCIDENT_INSURANCE) {
    console.log(`Cross sell | Unsupported product: ${props.product.name}`)
    return null
  }

  if (!show) return null

  let content: ReactNode

  const homeInsuranceInCart =
    props.cart.entries.find((entry) => HOME_INSURANCES.includes(entry.product.name)) ?? null

  const experimentVariant = getExperimentVariantByName('QUICK_ADD')
  const showDefaultVariant = !experimentVariant || experimentVariant.id === 0

  if (showDefaultVariant) {
    content = (
      <QuickAddEditableView
        shopSessionId={props.shopSessionId}
        initialOffer={props.offer}
        pillow={props.product.pillowImage}
        title={props.product.displayNameFull}
        subtitle={t('USP_NO_BINDING_TIME')}
        productPageLink={props.product.pageLink}
        badge={t('QUICK_ADD_BADGE_LABEL')}
        Body={
          <ul>
            <ProductUsp>{t('ACCIDENT_OFFER_USP_1')}</ProductUsp>
            <ProductUsp>{t('ACCIDENT_OFFER_USP_2')}</ProductUsp>
            <ProductUsp>{t('ACCIDENT_OFFER_USP_3')}</ProductUsp>
          </ul>
        }
      />
    )
  } else if (experimentVariant.id === 1) {
    const householdSize = parseInt(props.offer.priceIntentData[CO_INSURED_DATA_KEY] || 0, 10) + 1
    const title = homeInsuranceInCart
      ? t('QUICK_ADD_TITLE', { product: props.product.displayNameShort })
      : props.product.displayNameFull
    const subtitle = t('QUICK_ADD_HOUSEHOLD_SIZE', { count: householdSize })
    const price = getOfferPrice(props.offer.cost)
    const primaryPillow = homeInsuranceInCart
      ? homeInsuranceInCart.product.pillowImage
      : props.product.pillowImage
    const secondaryPillow = homeInsuranceInCart ? props.product.pillowImage : undefined

    content = (
      <QuickAddBundleView
        title={title}
        subtitle={subtitle}
        primaryPillow={primaryPillow}
        secondaryPillow={secondaryPillow}
        href={props.product.pageLink}
        price={price}
        badge={{ children: t('QUICK_ADD_BADGE_LABEL') }}
        Body={
          <>
            <Text as="p" color="textTranslucentSecondary">
              {t('ACCIDENT_OFFER_DESCRIPTION_BUNDLE')}
              <QuickAddInfoDialog
                Header={
                  <>
                    <Pillow size="xlarge" {...props.product.pillowImage} />
                    <Heading as="h1" className={sprinkles({ mt: 'md' })} variant="standard.18">
                      {props.product.displayNameFull}
                    </Heading>
                    <Price color="textTranslucentSecondary" {...price} />
                  </>
                }
              >
                <Perils items={props.offer.variant.perils} />
              </QuickAddInfoDialog>
            </Text>
            <ul>
              <ProductUsp>{t('ACCIDENT_OFFER_USP_1')}</ProductUsp>
              <ProductUsp>{t('ACCIDENT_OFFER_USP_2')}</ProductUsp>
              <ProductUsp>{t('ACCIDENT_OFFER_USP_3')}</ProductUsp>
            </ul>
          </>
        }
        Footer={
          <SpaceFlex space={0.5}>
            <DismissButton variant="secondary" fullWidth={true} />
            <Button
              size="medium"
              fullWidth={true}
              onClick={() => addOfferToCart(props.offer)}
              loading={loading}
            >
              {t('QUICK_ADD_BUTTON_BUNDLE')}
            </Button>
          </SpaceFlex>
        }
      />
    )
  }

  trackExperimentImpression(Experiments.getId('QUICK_ADD'), tracking)

  return (
    <div className={quickAddSection}>
      <Heading variant="standard.18" as={'h2'}>
        {t('QUICK_ADD_BUNDLE_HEADER')}
      </Heading>
      {content}
    </div>
  )
}
