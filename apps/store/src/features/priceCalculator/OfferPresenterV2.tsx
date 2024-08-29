import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useInView } from 'framer-motion'
import { useSetAtom, useStore } from 'jotai'
import { useTranslation } from 'next-i18next'
import { memo, type MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Button, tokens, yStack } from 'ui'
import { CancellationForm } from '@/components/Cancellation/CancellationForm'
import Collapsible from '@/components/Collapsible/Collapsible'
import { InfoCard } from '@/components/InfoCard/InfoCard'
import { SSN_SE_SECTION_ID } from '@/components/PriceCalculator/SsnSeSection'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { useOfferDetails } from '@/components/ProductItem/useOfferDetails'
import { ProductDetails } from '@/components/ProductItemV2/ProductDetails'
import {
  activeFormSectionIdAtom,
  priceCalculatorFormAtom,
  usePriceIntent,
} from '@/components/ProductPage/PurchaseForm/priceIntentAtoms'
import {
  useSelectedOffer,
  useSelectedOfferValueOrThrow,
} from '@/components/ProductPage/PurchaseForm/useSelectedOffer'
import { useTiersAndDeductibles } from '@/components/ProductPage/PurchaseForm/useTiersAndDeductibles'
import { useCartEntryToReplace } from '@/components/ProductPage/useCartEntryToReplace'
import { DiscountFieldContainer } from '@/components/ShopBreakdown/DiscountFieldContainer'
import { DeductibleSelectorV2 } from '@/features/priceCalculator/DeductibleSelectorV2'
import { priceCalculatorStepAtom } from '@/features/priceCalculator/priceCalculatorAtoms'
import { ProductCardSmall } from '@/features/priceCalculator/ProductCardSmall'
import { ProductTierSelectorV2 } from '@/features/priceCalculator/ProductTierSelectorV2'
import { BankSigneringEvent } from '@/services/bankSignering'
import { ExternalInsuranceCancellationOption } from '@/services/graphql/generated'
import {
  useShopSessionIdOrThrow,
  useShopSessionValueOrThrow,
} from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useAddToCart } from '@/utils/useAddToCart'
import { OfferPriceDetails } from './OfferPriceDetails'

export const OfferPresenterV2 = memo(() => {
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
    <div className={yStack({ gap: 'md' })}>
      {tiers.length > 1 && (
        <div className={yStack({ alignItems: 'stretch', gap: 'md' })}>
          <ProductTierSelectorV2
            offers={tiers}
            selectedOffer={selectedTier}
            onValueChange={handleOfferChange}
          />
        </div>
      )}

      {deductibles.length > 1 && (
        <div className={yStack({ alignItems: 'stretch', gap: 'md' })}>
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
  const { t } = useTranslation('purchase-form')
  const shopSessionId = useShopSessionIdOrThrow()
  const selectedOffer = useSelectedOfferValueOrThrow()
  const priceIntent = usePriceIntent()

  const setPriceCalculatorStep = useSetAtom(priceCalculatorStepAtom)

  const entryToReplace = useCartEntryToReplace()
  const tracking = useTracking()
  const [addToCart, loadingAddToCart] = useAddToCart({
    shopSessionId,
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

  const handleAddToCart: MouseEventHandler = async (event) => {
    event.preventDefault()
    await addToCart(selectedOffer.id)
    setPriceCalculatorStep('viewBonusOffer')
  }

  const productData = useProductData()
  const productOfferIds = useMemo(
    () => priceIntent.offers.map(({ id }) => id),
    [priceIntent.offers],
  )

  const shopSession = useShopSessionValueOrThrow()

  return (
    <ProductCardSmall
      productName={productData.displayNameFull}
      pillowImageSrc={productData.pillowImage.src}
      subtitle={selectedOffer.exposure.displayNameShort}
    >
      <OfferDetails />

      {priceIntent.notifications?.map((notification, index) => (
        <InfoCard key={index}>{notification.message}</InfoCard>
      ))}

      <CancellationForm productOfferIds={productOfferIds} offer={selectedOffer} />

      {shopSession.cart.campaignsEnabled && (
        <>
          <DiscountFieldContainer shopSession={shopSession} />
          <Separator />
        </>
      )}

      <OfferPriceDetails />

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

function OfferDetails() {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation('cart')
  const selectedOffer = useSelectedOfferValueOrThrow()
  const productDetails = useOfferDetails(selectedOffer)

  const productDocuments = selectedOffer.variant.documents.map((item) => ({
    title: item.displayName,
    url: item.url,
  }))

  const store = useStore()
  const handleEditClick = () => {
    const form = store.get(priceCalculatorFormAtom)
    const targetSectionId = form.sections.find((section) => section.id !== SSN_SE_SECTION_ID)!.id
    store.set(activeFormSectionIdAtom, targetSectionId)
    store.set(priceCalculatorStepAtom, 'fillForm')
    // TODO: Scroll to form section top when opening to edit (atom effect?)
  }

  return (
    <Collapsible.Root open={expanded} onOpenChange={setExpanded}>
      <Collapsible.Trigger asChild>
        <Button variant="secondary-alt" size="medium" fullWidth={true}>
          {expanded ? t('HIDE_DETAILS_BUTTON_LABEL') : t('SHOW_DETAILS_BUTTON_LABEL')}
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <ProductDetails
          items={productDetails}
          documents={productDocuments}
          className={sprinkles({ marginTop: 'md' })}
          afterDetailsSection={
            <Button variant="secondary" size="medium" fullWidth={true} onClick={handleEditClick}>
              {t('EDIT_INFORMATION_BUTTON_LABEL')}
            </Button>
          }
        />
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

function Separator() {
  return <hr style={{ height: '1px', backgroundColor: tokens.colors.borderTranslucent1 }} />
}
