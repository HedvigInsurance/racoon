import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useInView } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { RefObject, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Space, Text, theme } from 'ui'
import { useUpdateCancellation } from '@/components/ProductPage/PurchaseForm/useUpdateCancellation'
import { useUpdateStartDate } from '@/components/ProductPage/PurchaseForm/useUpdateStartDate'
import { ScrollPast } from '@/components/ProductPage/ScrollPast/ScrollPast'
import { ScrollToTopButton } from '@/components/ProductPage/ScrollToButton/ScrollToButton'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import {
  ExternalInsuranceCancellationOption,
  ProductOfferFragment,
  RedeemedCampaign,
} from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useTracking } from '@/services/Tracking/useTracking'
import { convertToDate } from '@/utils/date'
import { PageLink } from '@/utils/PageLink'
import { useAddToCart } from '@/utils/useAddToCart'
import { useGetDiscountExplanation } from '@/utils/useDiscountExplanation'
import { useFormatter } from '@/utils/useFormatter'
import { CancellationForm, CancellationOption } from './CancellationForm/CancellationForm'
import { ComparisonTableModal } from './ComparisonTableModal'
import { DeductibleSelector } from './DeductibleSelector'
import { DiscountTooltip } from './DiscountTooltip/DiscountTooltip'
import { getOffersByPrice } from './getOffersByPrice'
import { ProductTierSelector } from './ProductTierSelector'
import { useSelectedOffer } from './useSelectedOffer'

enum AddToCartRedirect {
  Cart = 'Cart',
  Checkout = 'Checkout',
}

type Props = {
  priceIntent: PriceIntent
  shopSession: ShopSession
  selectedOffer: ProductOfferFragment
  scrollPastRef: RefObject<HTMLElement>
  // TODO: Use better type
  onAddedToCart: (productOffer: ProductOfferFragment, nextUrl?: string) => void
  onClickEdit: () => void
}

export const OfferPresenter = (props: Props) => {
  const { priceIntent, shopSession, scrollPastRef, onAddedToCart, onClickEdit, selectedOffer } =
    props
  const [, setSelectedOffer] = useSelectedOffer()
  const { t } = useTranslation('purchase-form')
  const formatter = useFormatter()
  const [addToCartRedirect, setAddToCartRedirect] = useState<AddToCartRedirect | null>(null)

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

  const [updateStartDate, updateStartDateResult] = useUpdateStartDate({ priceIntent })

  const [addToCart, loadingAddToCart] = useAddToCart({
    shopSessionId: shopSession.id,
    onSuccess(productOfferId) {
      const addedProductOffer = priceIntent.offers.find((offer) => offer.id === productOfferId)

      if (addedProductOffer === undefined) {
        throw new Error(`Unknown offer added to cart: ${productOfferId}`)
      }

      let nextUrl: string | undefined = undefined
      tracking.reportAddToCart(addedProductOffer, 'store')
      if (addToCartRedirect === AddToCartRedirect.Checkout) {
        tracking.reportBeginCheckout(shopSession.cart)
        nextUrl = PageLink.checkout({ expandCart: true })
      }

      const isBankSignering =
        addedProductOffer.cancellation.option === ExternalInsuranceCancellationOption.Banksignering
      if (isBankSignering && addedProductOffer.cancellation.requested) {
        datadogRum.addAction('BankSignering Requested')
      }

      onAddedToCart(addedProductOffer, nextUrl)
    },
  })

  const handleClickSubmit = (redirect: AddToCartRedirect) => () => {
    datadogRum.addAction(`PriceCalculator AddToCart ${redirect}`)
    setAddToCartRedirect(redirect)
  }

  const [handleUpdateCancellation, updateCancellationInfo] = useUpdateCancellation({ priceIntent })

  const discountTooltipProps = useDiscountTooltipProps(
    selectedOffer,
    shopSession.cart.redeemedCampaign ?? undefined,
  )

  const displayPrice = formatter.monthlyPrice(selectedOffer.cost.net)

  const cancellationOption = getCancellationOption({
    priceIntent,
    productOffer: selectedOffer,
  })

  const loading =
    loadingAddToCart || updateCancellationInfo.loading || updateStartDateResult.loading

  const startDate = convertToDate(selectedOffer.startDate)

  // Sort deductibles based on monthly price
  const sortedOffers = useMemo(() => getOffersByPrice(priceIntent.offers), [priceIntent.offers])

  const tiers = useMemo(() => {
    const tierList: Array<ProductOfferFragment> = []
    const usedTiers = new Set<string>()
    for (const offer of sortedOffers) {
      const typeOfContract = offer.variant.typeOfContract
      if (usedTiers.has(typeOfContract)) continue

      usedTiers.add(typeOfContract)
      tierList.push(typeOfContract === selectedOffer.variant.typeOfContract ? selectedOffer : offer)
    }
    return tierList
  }, [sortedOffers, selectedOffer])

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

  const deductibles = useMemo(() => {
    return sortedOffers.filter(
      (item) => item.variant.typeOfContract === selectedOffer.variant.typeOfContract,
    )
  }, [sortedOffers, selectedOffer])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addToCart(selectedOffer.id)
  }

  return (
    <>
      <Space y={1}>
        <form ref={offerRef} onSubmit={handleSubmit}>
          <Space y={2}>
            <SpaceFlex direction="vertical" align="center" space={1}>
              {discountTooltipProps && <DiscountTooltip {...discountTooltipProps} />}
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
                />
              )}

              <CancellationForm
                option={cancellationOption}
                startDate={startDate}
                onAutoSwitchChange={handleUpdateCancellation}
                onStartDateChange={(startDate) => updateStartDate({ dateValue: startDate })}
              />

              <Button
                type="submit"
                variant="primary"
                onClick={handleClickSubmit(AddToCartRedirect.Cart)}
                loading={loading && addToCartRedirect === AddToCartRedirect.Cart}
                disabled={loading}
              >
                {t('ADD_TO_CART_BUTTON_LABEL')}
              </Button>

              <Button
                type="submit"
                variant="primary-alt"
                onClick={handleClickSubmit(AddToCartRedirect.Checkout)}
                loading={loading && addToCartRedirect === AddToCartRedirect.Checkout}
                disabled={loading}
              >
                {t('QUICK_CHECKOUT_BUTTON_LABEL')}
              </Button>
            </Space>
          </Space>
        </form>

        {tiers.length > 1 && (
          <ComparisonTableModal tiers={tiers} selectedTierId={selectedTier.id} />
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

type GetCancellationOptionParams = {
  priceIntent: PriceIntent
  productOffer: ProductOfferFragment
}

const useDiscountTooltipProps = (
  selectedOffer: ProductOfferFragment,
  campaign?: RedeemedCampaign,
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

const getCancellationOption = (params: GetCancellationOptionParams): CancellationOption => {
  const {
    productOffer: { cancellation, startDate },
    priceIntent: { externalInsurer },
  } = params

  const offerStartDate = convertToDate(startDate)
  const hasInvalidRenewalDate =
    cancellation.option === ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate
  const invalidRenewalDate = offerStartDate && hasInvalidRenewalDate ? offerStartDate : null

  switch (cancellation.option) {
    case ExternalInsuranceCancellationOption.Iex:
      return {
        type: ExternalInsuranceCancellationOption.Iex,
        companyName: externalInsurer?.displayName ?? 'Unknown',
        requested: cancellation.requested,
      }

    case ExternalInsuranceCancellationOption.Banksignering:
    case ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate:
      return {
        type: ExternalInsuranceCancellationOption.Banksignering,
        companyName: externalInsurer?.displayName ?? 'Unknown',
        requested: cancellation.requested,
        invalidRenewalDate,
      }

    default:
      return { type: ExternalInsuranceCancellationOption.None }
  }
}
