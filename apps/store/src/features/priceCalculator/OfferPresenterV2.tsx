import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { memo, type MouseEventHandler, type ReactNode, useEffect, useMemo, useRef } from 'react'
import { Button, Text, yStack } from 'ui'
import { CancellationForm } from '@/components/Cancellation/CancellationForm'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { DiscountTooltip } from '@/components/ProductPage/PurchaseForm/DiscountTooltip/DiscountTooltip'
import { useDiscountTooltipProps } from '@/components/ProductPage/PurchaseForm/DiscountTooltip/useDiscountTooltipProps'
import { usePriceIntent } from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import { useSelectedOffer } from '@/components/ProductPage/PurchaseForm/useSelectedOffer'
import { useTiersAndDeductibles } from '@/components/ProductPage/PurchaseForm/useTiersAndDeductibles'
import { useCartEntryToReplace } from '@/components/ProductPage/useCartEntryToReplace'
import { BUNDLE_DISCOUNT_ELIGIBLE_PRODUCT_IDS } from '@/features/bundleDiscount/bundleDiscount'
import { BundleDiscountOfferTooltip } from '@/features/bundleDiscount/BundleDiscountOfferTooltip'
import { DeductibleSelectorV2 } from '@/features/priceCalculator/DeductibleSelectorV2'
import { ProductCardSmall } from '@/features/priceCalculator/ProductCardSmall'
import { ProductTierSelectorV2 } from '@/features/priceCalculator/ProductTierSelectorV2'
import { BankSigneringEvent } from '@/services/bankSignering'
import { ExternalInsuranceCancellationOption } from '@/services/graphql/generated'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useAddToCart } from '@/utils/useAddToCart'
import { useFormatter } from '@/utils/useFormatter'

export const OfferPresenterV2 = memo(() => {
  const { shopSession } = useShopSession()
  if (shopSession == null) {
    throw new Error('shopSession must be defined')
  }
  const priceIntent = usePriceIntent()
  const [selectedOffer, setSelectedOffer] = useSelectedOffer()
  if (selectedOffer == null) {
    throw new Error('selectedOffer must be defined')
  }
  const { tiers, deductibles } = useTiersAndDeductibles({
    offers: priceIntent.offers,
    selectedOffer,
  })

  const handleOfferChange = (offerId: string) => {
    const offer = priceIntent.offers.find((offer) => offer.id === offerId)

    if (offer === undefined) {
      datadogLogs.logger.error(`Unknown offer selected: ${offerId}`)
      return
    }

    setSelectedOffer(offer)
  }

  const offerRef = useRef(null)
  const tracking = useTracking()
  const isInView = useInView(offerRef, { once: true })
  useEffect(() => {
    if (isInView) {
      tracking.reportViewItem(selectedOffer, 'store')
    }
  }, [selectedOffer, tracking, isInView])

  const selectedTier = useMemo(() => {
    const tier = tiers.find(
      (item) => item.variant.typeOfContract === selectedOffer.variant.typeOfContract,
    )

    if (tier === undefined) {
      datadogLogs.logger.warn(`Unknown tier selected`, {
        selectedOffer: selectedOffer.variant.typeOfContract,
        tiers: tiers.map((item) => item.variant.typeOfContract),
      })
      return tiers[0]
    }

    return tier
  }, [tiers, selectedOffer])

  return (
    <div className={yStack({})}>
      {tiers.length > 1 && (
        <div className={yStack({ alignItems: 'stretch' })}>
          <ProductTierSelectorV2
            offers={tiers}
            selectedOffer={selectedTier}
            onValueChange={handleOfferChange}
          />
        </div>
      )}

      {deductibles.length > 1 && (
        <div className={yStack({ alignItems: 'stretch' })}>
          <DeductibleSelectorV2
            offers={deductibles}
            selectedOffer={selectedOffer}
            onValueChange={handleOfferChange}
          />
        </div>
      )}

      <OfferSummary />
    </div>
  )
})
OfferPresenterV2.displayName = 'OfferPresenterV2'

function OfferSummary() {
  const { shopSession } = useShopSession()
  if (shopSession == null) {
    throw new Error('shopSession must be defined')
  }
  const [selectedOffer] = useSelectedOffer()
  if (selectedOffer == null) {
    throw new Error('selectedOffer must be defined')
  }
  const { t } = useTranslation('purchase-form')
  const formatter = useFormatter()
  const priceIntent = usePriceIntent()
  const discountTooltipProps = useDiscountTooltipProps(
    selectedOffer,
    shopSession.cart.redeemedCampaign ?? undefined,
  )
  let discountTooltip: ReactNode = null
  if (discountTooltipProps != null) {
    discountTooltip = <DiscountTooltip {...discountTooltipProps} />
  } else if (
    shopSession.experiments?.bundleDiscount &&
    BUNDLE_DISCOUNT_ELIGIBLE_PRODUCT_IDS.has(priceIntent.product.id)
  ) {
    discountTooltip = <BundleDiscountOfferTooltip offer={selectedOffer} />
  }

  const displayPrice = formatter.monthlyPrice(selectedOffer.cost.net)

  const entryToReplace = useCartEntryToReplace()
  const tracking = useTracking()
  const [addToCart, loadingAddToCart] = useAddToCart({
    shopSessionId: shopSession.id,
    entryToReplace: entryToReplace?.id,
    onSuccess(productOfferId) {
      const addedProductOffer = priceIntent.offers.find((offer) => offer.id === productOfferId)

      if (addedProductOffer === undefined) {
        throw new Error(`Unknown offer added to cart: ${productOfferId}`)
      }

      tracking.reportAddToCart(addedProductOffer, 'store')

      const isBankSignering =
        addedProductOffer.cancellation.option === ExternalInsuranceCancellationOption.Banksignering
      if (isBankSignering) {
        datadogRum.addAction(BankSigneringEvent.Available)
        if (addedProductOffer.cancellation.requested) {
          datadogRum.addAction(BankSigneringEvent.Requested)
        }
      }
    },
  })

  const router = useRouter()
  const locale = useRoutingLocale()
  const handleAddToCart: MouseEventHandler = async (event) => {
    event.preventDefault()
    await addToCart(selectedOffer.id)
    router.push(PageLink.cart({ locale }).pathname)
  }

  const productData = useProductData()
  const productOfferIds = useMemo(
    () => priceIntent.offers.map(({ id }) => id),
    [priceIntent.offers],
  )

  return (
    <ProductCardSmall productData={productData} subtitle={selectedOffer.exposure.displayNameShort}>
      <Button
        variant="secondary-alt"
        onClick={() => window.alert('TODO: Show details')}
        fullWidth={true}
      >
        {t('SHOW_DETAILS_BUTTON_LABEL', { ns: 'cart' })}
      </Button>

      {discountTooltip}
      <Text as="p" align="center" size="xl">
        {displayPrice}
      </Text>

      <CancellationForm productOfferIds={productOfferIds} offer={selectedOffer} />

      <Button
        variant="primary"
        onClick={handleAddToCart}
        loading={loadingAddToCart}
        fullWidth={true}
      >
        {t('ADD_TO_CART_BUTTON_LABEL')}
      </Button>
    </ProductCardSmall>
  )
}
