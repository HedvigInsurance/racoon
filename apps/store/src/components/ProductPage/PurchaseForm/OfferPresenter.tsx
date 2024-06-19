import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useInView } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import type { MouseEventHandler, ReactNode, RefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Space, Text, PlusIcon, theme } from 'ui'
import { CancellationForm } from '@/components/Cancellation/CancellationForm'
import { usePriceIntent } from '@/components/ProductPage/PriceIntentContext'
import { ScrollPast } from '@/components/ProductPage/ScrollPast/ScrollPast'
import { ScrollToTopButton } from '@/components/ProductPage/ScrollToButton/ScrollToButton'
import { useCartEntryToReplace } from '@/components/ProductPage/useCartEntryToReplace'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { BUNDLE_DISCOUNT_ELIGIBLE_PRODUCT_IDS } from '@/features/bundleDiscount/bundleDiscount'
import { BundleDiscountOfferTooltip } from '@/features/bundleDiscount/BundleDiscountOfferTooltip'
import { BankSigneringEvent } from '@/services/bankSignering'
import type { ProductOfferFragment, RedeemedCampaignFragment } from '@/services/graphql/generated'
import { ExternalInsuranceCancellationOption } from '@/services/graphql/generated'
import type { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useTracking } from '@/services/Tracking/useTracking'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useAddToCart } from '@/utils/useAddToCart'
import { useGetDiscountExplanation } from '@/utils/useDiscountExplanation'
import { useFormatter } from '@/utils/useFormatter'
import { ComparisonTableModal } from './ComparisonTableModal'
import { DeductibleSelector } from './DeductibleSelector'
import { DiscountTooltip } from './DiscountTooltip/DiscountTooltip'
import { ProductTierSelector } from './ProductTierSelector'
import { useSelectedOffer } from './useSelectedOffer'
import { useTiersAndDeductibles } from './useTiersAndDeductibles'

enum AddToCartRedirect {
  Cart = 'Cart',
  Checkout = 'Checkout',
}

type Props = {
  priceIntent: PriceIntent
  shopSession: ShopSession
  selectedOffer: ProductOfferFragment
  scrollPastRef: RefObject<HTMLElement>
  onClickEdit: () => void
  notifyProductAdded: (item: ProductOfferFragment) => void
}

export const OfferPresenter = (props: Props) => {
  const { priceIntent, shopSession, scrollPastRef, onClickEdit, selectedOffer } = props
  const [, , resetPriceIntent] = usePriceIntent()
  const [, setSelectedOffer] = useSelectedOffer()
  const { t } = useTranslation('purchase-form')
  const formatter = useFormatter()
  const [addToCartRedirect, setAddToCartRedirect] = useState<AddToCartRedirect | null>(null)
  const locale = useRoutingLocale()
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

  const entryToReplace = useCartEntryToReplace()
  // Awkward solution to varying post-success behavior between addToCart and goToCheckout
  const onSuccessRef = useRef<(addedProductOffer: ProductOfferFragment) => void>(() => {})
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
      onSuccessRef.current(addedProductOffer)
    },
  })

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

  const productOfferIds = useMemo(
    () => props.priceIntent.offers.map(({ id }) => id),
    [props.priceIntent.offers],
  )

  const handleAddToCart: MouseEventHandler = (event) => {
    event.preventDefault()
    datadogRum.addAction(`PriceCalculator AddToCart Cart`)
    setAddToCartRedirect(AddToCartRedirect.Cart)
    onSuccessRef.current = (addedProductOffer: ProductOfferFragment) => {
      props.notifyProductAdded(addedProductOffer)
      resetPriceIntent()
    }
    addToCart(selectedOffer.id)
  }

  const router = useRouter()
  const [isNavigatingToCheckout, setNavigatingToCheckout] = useState(false)
  const handleGoToCheckout: MouseEventHandler = (event) => {
    event.preventDefault()
    datadogRum.addAction(`PriceCalculator AddToCart Checkout`)
    setAddToCartRedirect(AddToCartRedirect.Checkout)
    onSuccessRef.current = () => {
      setNavigatingToCheckout(true)
      const nextUrl = PageLink.checkout({ locale, expandCart: true }).toRelative()
      tracking.reportBeginCheckout(shopSession.cart)
      router.push(nextUrl)
    }
    addToCart(selectedOffer.id)
  }

  const pathname = usePathname()
  const initialPathnameRef = useRef(pathname)
  useEffect(() => {
    // Finished navigating to checkout page, we can clean up now
    if (isNavigatingToCheckout && initialPathnameRef.current !== pathname) {
      resetPriceIntent()
    }
  }, [isNavigatingToCheckout, pathname, resetPriceIntent])

  return (
    <>
      <Space ref={offerRef} y={1}>
        <Space y={2}>
          <SpaceFlex direction="vertical" align="center" space={1}>
            {discountTooltip}
            <Space y={0.5}>
              <Text as="p" align="center" size="xl">
                {displayPrice}
              </Text>
              <Centered>
                <TextButton onClick={onClickEdit}>
                  <Text align="center" size="xs" color="textSecondary" as="span">
                    {t('PRESENT_OFFER_EDIT_BUTTON')}
                  </Text>
                </TextButton>
              </Centered>
            </Space>
          </SpaceFlex>

          <Space y={0.25}>
            {tiers.length > 1 && (
              <ProductTierSelector
                defaultOpen={true}
                offers={tiers}
                selectedOffer={selectedTier}
                onValueChange={handleOfferChange}
              />
            )}

            {deductibles.length > 1 && (
              <DeductibleSelector
                offers={deductibles}
                selectedOffer={selectedOffer}
                onValueChange={handleOfferChange}
                defaultOpen={true}
              />
            )}

            <CancellationForm productOfferIds={productOfferIds} offer={selectedOffer} />

            <Button
              variant="primary"
              onClick={handleAddToCart}
              loading={loadingAddToCart && addToCartRedirect === AddToCartRedirect.Cart}
              disabled={loadingAddToCart}
              fullWidth={true}
            >
              {t('ADD_TO_CART_BUTTON_LABEL')}
            </Button>

            <Button
              variant="primary-alt"
              onClick={handleGoToCheckout}
              loading={
                isNavigatingToCheckout ||
                (loadingAddToCart && addToCartRedirect === AddToCartRedirect.Checkout)
              }
              disabled={loadingAddToCart}
              fullWidth={true}
            >
              {t('QUICK_CHECKOUT_BUTTON_LABEL')}
            </Button>
          </Space>
        </Space>

        {tiers.length > 1 && (
          <SpaceFlex direction="vertical" align="center">
            <ComparisonTableModal tiers={tiers} selectedTierId={selectedTier.id}>
              <Button variant="ghost" size="small">
                <SpaceFlex space={0.5} align="center">
                  <PlusIcon />
                  {t('COMPARE_COVERAGE_BUTTON')}
                </SpaceFlex>
              </Button>
            </ComparisonTableModal>
          </SpaceFlex>
        )}
      </Space>
      <ScrollPast targetRef={scrollPastRef}>
        <ScrollToTopButton type="button">
          <ScrollPastButtonContent>
            <span>{displayPrice}</span>
            <Separator />
            <span>{t('ADD_TO_CART_BUTTON_LABEL')}</span>
          </ScrollPastButtonContent>
        </ScrollToTopButton>
      </ScrollPast>
    </>
  )
}

const ScrollPastButtonContent = styled.div({
  display: 'flex',
  justifyContent: 'center',
})

const Centered = styled.div({
  display: 'flex',
  justifyContent: 'center',
})

const TextButton = styled.button({
  cursor: 'pointer',
  lineHeight: 1,

  backgroundColor: theme.colors.light,
  ':focus-visible': {
    textDecorationLine: 'underline',
    textDecorationColor: theme.colors.textPrimary,
    textUnderlineOffset: 5,
  },

  '@media (hover: hover)': {
    ':hover > span': {
      color: theme.colors.textPrimary,
    },
  },
})

const Separator = styled.div({
  width: 1,
  backgroundColor: theme.colors.gray600,
  margin: `0 ${theme.space.sm}`,
  alignSelf: 'stretch',
})

const useDiscountTooltipProps = (
  selectedOffer: ProductOfferFragment,
  campaign?: RedeemedCampaignFragment,
) => {
  const { t } = useTranslation(['purchase-form', 'cart'])
  const formatter = useFormatter()
  const getDiscountExplanation = useGetDiscountExplanation()

  const tooltipProps = useMemo(() => {
    if (selectedOffer.priceMatch) {
      const company = selectedOffer.priceMatch.externalInsurer.displayName

      if (selectedOffer.priceMatch.priceReduction.amount < 1) {
        // No price reduction due to incomparable offers
        const amount = formatter.monthlyPrice(selectedOffer.priceMatch.externalPrice)
        return {
          children: t('PRICE_MATCH_BUBBLE_INCOMPARABLE_TITLE', { amount, company }),
          subtitle: t('PRICE_MATCH_BUBBLE_INCOMPARABLE_SUBTITLE'),
          color: 'gray',
        } as const
      }

      const priceReduction = formatter.monthlyPrice(selectedOffer.priceMatch.priceReduction)

      return {
        children: t('PRICE_MATCH_BUBBLE_SUCCESS_TITLE', { amount: priceReduction }),
        subtitle: t('PRICE_MATCH_BUBBLE_SUCCESS_SUBTITLE', { company }),
        color: 'green',
      } as const
    }

    if (campaign && selectedOffer.cost.discount.amount > 0) {
      return {
        children: getDiscountExplanation({
          ...campaign.discount,
          amount: selectedOffer.cost.discount,
        }),
        subtitle: t('DISCOUNT_PRICE_AFTER_EXPIRATION', {
          amount: formatter.monthlyPrice(selectedOffer.cost.gross),
          ns: 'cart',
        }),
        color: 'green',
      } as const
    }
  }, [t, formatter, getDiscountExplanation, selectedOffer, campaign])

  return tooltipProps
}
