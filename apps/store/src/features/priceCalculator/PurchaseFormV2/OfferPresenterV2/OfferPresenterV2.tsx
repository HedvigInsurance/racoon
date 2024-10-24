import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useInView } from 'framer-motion'
import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useTranslation } from 'next-i18next'
import { memo, type MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Button, ChevronIcon, tokens, yStack } from 'ui'
import { CancellationForm } from '@/components/Cancellation/CancellationForm'
import Collapsible from '@/components/Collapsible/Collapsible'
import { InfoCard } from '@/components/InfoCard/InfoCard'
import { SSN_SE_SECTION_ID } from '@/components/PriceCalculator/SsnSeSection'
import { useOfferDetails } from '@/components/ProductCard/useOfferDetails'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
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
import {
  priceCalculatorStepAtom,
  priceCalculatorAddedOffer,
} from '@/features/priceCalculator/priceCalculatorAtoms'
import { DeductibleSelectorV2 } from '@/features/priceCalculator/PurchaseFormV2/OfferPresenterV2/DeductibleSelectorV2/DeductibleSelectorV2'
import { ProductCardSmall } from '@/features/priceCalculator/PurchaseFormV2/OfferPresenterV2/ProductCardSmall/ProductCardSmall'
import { ProductTierSelectorV2 } from '@/features/priceCalculator/PurchaseFormV2/OfferPresenterV2/ProductTierSelectorV2/ProductTierSelectorV2'
import { BankSigneringEvent } from '@/services/bankSignering'
import { ExternalInsuranceCancellationOption } from '@/services/graphql/generated'
import {
  useShopSessionIdOrThrow,
  useShopSessionValueOrThrow,
} from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useAddToCart } from '@/utils/useAddToCart'
import { SectionTitle, SectionSubtitle } from '../SectionHeading'
import { offerPresenterWrapper, tiersWrapper } from './OfferPresenterV2.css'
import { OfferPriceDetails } from './OfferPriceDetails'

export const OfferPresenterV2 = memo(() => {
  const { t } = useTranslation('purchase-form')
  const priceIntent = usePriceIntent()
  const setStep = useSetAtom(priceCalculatorStepAtom)
  const setActiveSectionId = useSetAtom(activeFormSectionIdAtom)
  const form = useAtomValue(priceCalculatorFormAtom)
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

  const handleEditInformation = () => {
    setStep('fillForm')
    // Make sure to always go to the last section of the form when editing
    const lastFormSectionId = form.sections[form.sections.length - 1].id
    setActiveSectionId(lastFormSectionId)
    // Make sure the user is viewing the start of the form when editing
    window.scrollTo({ top: 0, behavior: 'instant' })
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
    <div className={offerPresenterWrapper}>
      <Button
        className={sprinkles({ marginRight: 'auto' })}
        size="small"
        variant="secondary"
        Icon={<ChevronIcon size="0.75rem" direction="left" />}
        onClick={handleEditInformation}
      >
        {t('OFFER_PRESENTER_EDIT_INFO_BUTTON_LABEL')}
      </Button>

      <div className={tiersWrapper}>
        {tiers.length > 1 && (
          <div>
            <SectionTitle>{t('OFFER_PRESENTER_TIERS_TITLE')}</SectionTitle>

            <SectionSubtitle className={sprinkles({ marginBottom: 'lg' })}>
              {t('OFFER_PRESENTER_TIERS_SUBTITLE')}
            </SectionSubtitle>

            <div className={yStack({ alignItems: 'stretch', gap: 'md' })}>
              <ProductTierSelectorV2
                offers={tiers}
                selectedOffer={selectedTier}
                onValueChange={handleOfferChange}
              />
            </div>
          </div>
        )}

        {deductibles.length > 1 && (
          <div>
            <SectionTitle>{t('OFFER_PRESENTER_DEDUCTIBLE_TITLE')}</SectionTitle>

            <SectionSubtitle className={sprinkles({ marginBottom: 'lg' })}>
              {t('OFFER_PRESENTER_DEDUCTIBLE_SUBTITLE')}
            </SectionSubtitle>

            <div className={yStack({ alignItems: 'stretch', gap: 'md' })}>
              <DeductibleSelectorV2
                offers={deductibles}
                selectedOffer={selectedOffer}
                onValueChange={handleOfferChange}
              />
            </div>
          </div>
        )}

        <OfferSummary />
      </div>
    </div>
  )
})
OfferPresenterV2.displayName = 'OfferPresenterV2'

function OfferSummary() {
  const { t } = useTranslation('purchase-form')
  const shopSessionId = useShopSessionIdOrThrow()
  const selectedOffer = useSelectedOfferValueOrThrow()
  const priceIntent = usePriceIntent()
  const setAddedOffer = useSetAtom(priceCalculatorAddedOffer)

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
    // Make sure user views "added to cart" notification and/or bundle discount banner
    window.scrollTo({ top: 0, behavior: 'instant' })
    setAddedOffer(selectedOffer)
  }

  const productData = useProductData()
  const productOfferIds = useMemo(
    () => priceIntent.offers.map(({ id }) => id),
    [priceIntent.offers],
  )

  const shopSession = useShopSessionValueOrThrow()

  return (
    <div>
      <SectionTitle>{t('OFFER_PRESENTER_SUMMARY_TITLE')}</SectionTitle>

      <SectionSubtitle className={sprinkles({ marginBottom: 'lg' })}>
        {t('OFFER_PRESENTER_SUMMARY_SUBTITLE')}
      </SectionSubtitle>

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
    </div>
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
        <Button variant="outline" size="medium" fullWidth={true}>
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
