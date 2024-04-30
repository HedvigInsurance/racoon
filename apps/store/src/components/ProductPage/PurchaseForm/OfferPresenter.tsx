import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useInView } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import type { RefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Space, Text, theme } from 'ui'
import { CancellationForm } from '@/components/Cancellation/CancellationForm'
import { ScrollPast } from '@/components/ProductPage/ScrollPast/ScrollPast'
import { ScrollToTopButton } from '@/components/ProductPage/ScrollToButton/ScrollToButton'
import { useCartEntryToReplace } from '@/components/ProductPage/useCartEntryToReplace'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { BankSigneringEvent } from '@/services/bankSignering'
import type { ProductOfferFragment, RedeemedCampaignFragment } from '@/services/graphql/generated'
import { ExternalInsuranceCancellationOption } from '@/services/graphql/generated'
import type { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useTracking } from '@/services/Tracking/useTracking'
import { getOffersByPrice } from '@/utils/getOffersByPrice'
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
  const locale = useRoutingLocale()

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
  const [addToCart, loadingAddToCart] = useAddToCart({
    shopSessionId: shopSession.id,
    entryToReplace: entryToReplace?.id,
    onSuccess(productOfferId) {
      const addedProductOffer = priceIntent.offers.find((offer) => offer.id === productOfferId)

      if (addedProductOffer === undefined) {
        throw new Error(`Unknown offer added to cart: ${productOfferId}`)
      }

      let nextUrl: string | undefined = undefined
      tracking.reportAddToCart(addedProductOffer, 'store')
      if (addToCartRedirect === AddToCartRedirect.Checkout) {
        tracking.reportBeginCheckout(shopSession.cart)
        nextUrl = PageLink.checkout({ locale, expandCart: true }).toRelative()
      }

      const isBankSignering =
        addedProductOffer.cancellation.option === ExternalInsuranceCancellationOption.Banksignering
      if (isBankSignering) {
        datadogRum.addAction(BankSigneringEvent.Available)
        if (addedProductOffer.cancellation.requested) {
          datadogRum.addAction(BankSigneringEvent.Requested)
        }
      }

      onAddedToCart(addedProductOffer, nextUrl)
    },
  })

  const handleClickSubmit = (redirect: AddToCartRedirect) => () => {
    datadogRum.addAction(`PriceCalculator AddToCart ${redirect}`)
    setAddToCartRedirect(redirect)
  }

  const discountTooltipProps = useDiscountTooltipProps(
    selectedOffer,
    shopSession.cart.redeemedCampaign ?? undefined,
  )

  const displayPrice = formatter.monthlyPrice(selectedOffer.cost.net)

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

              <CancellationForm priceIntentId={priceIntent.id} offer={selectedOffer} />

              <Button
                type="submit"
                variant="primary"
                onClick={handleClickSubmit(AddToCartRedirect.Cart)}
                loading={loadingAddToCart && addToCartRedirect === AddToCartRedirect.Cart}
                disabled={loadingAddToCart}
              >
                {t('ADD_TO_CART_BUTTON_LABEL')}
              </Button>

              <Button
                type="submit"
                variant="primary-alt"
                onClick={handleClickSubmit(AddToCartRedirect.Checkout)}
                loading={loadingAddToCart && addToCartRedirect === AddToCartRedirect.Checkout}
                disabled={loadingAddToCart}
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
