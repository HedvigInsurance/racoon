import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { RefObject, useMemo, useState } from 'react'
import { Button, Space, Text } from 'ui'
import { useUpdateCancellation } from '@/components/ProductPage/PurchaseForm/useUpdateCancellation'
import { useUpdateStartDate } from '@/components/ProductPage/PurchaseForm/useUpdateStartDate'
import { ScrollPast } from '@/components/ProductPage/ScrollPast/ScrollPast'
import { ScrollToButton } from '@/components/ProductPage/ScrollToButton/ScrollToButton'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TierSelector } from '@/components/TierSelector/TierSelector'
import {
  ExternalInsuranceCancellationOption,
  ProductOfferFragment,
} from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'
import { CancellationForm, CancellationOption } from './CancellationForm/CancellationForm'
import { PriceMatchBubble } from './PriceMatchBubble/PriceMatchBubble'
import { useHandleSubmitAddToCart } from './useHandleSubmitAddToCart'

type Props = {
  priceIntent: PriceIntent
  shopSession: ShopSession
  scrollPastRef: RefObject<HTMLElement>
  // TODO: Use better type
  onAddedToCart: (productOffer: ProductOfferFragment) => void
  onClickEdit: () => void
}

export const OfferPresenter = (props: Props) => {
  const { priceIntent, shopSession, scrollPastRef, onAddedToCart, onClickEdit } = props
  const { t } = useTranslation('purchase-form')
  const formatter = useFormatter()
  const [selectedOffer, setSelectedOffer] = useState(priceIntent.offers[0])
  const selectedOfferId = selectedOffer.id

  const handleTierSelectorValueChange = (offerId: string) => {
    const offer = priceIntent.offers.find((offer) => offer.id === offerId)

    if (offer === undefined) {
      datadogLogs.logger.error(`Unknown offer selected: ${offerId}`)
      return
    }

    setSelectedOffer(offer)
  }

  const [updateStartDate, updateStartDateInfo] = useUpdateStartDate({ priceIntent })

  const handleStartDateChange = (startDate: Date) => {
    updateStartDate({ dateValue: startDate })
  }

  const [handleSubmitAddToCart, loadingAddToCart] = useHandleSubmitAddToCart({
    cartId: shopSession.cart.id,
    priceIntentId: priceIntent.id,
    onSuccess(productOfferId) {
      const addedProductOffer = priceIntent.offers.find((offer) => offer.id === productOfferId)

      if (addedProductOffer === undefined) {
        throw new Error(`Unknown offer added to cart: ${productOfferId}`)
      }

      onAddedToCart(addedProductOffer)
    },
  })

  const [handleUpdateCancellation, updateCancellationInfo] = useUpdateCancellation({ priceIntent })

  const displayPrice = formatter.monthlyPrice(selectedOffer.price)

  const cancellationOption = getCancellationOption({ priceIntent, productOffer: selectedOffer })

  const loading = loadingAddToCart || updateCancellationInfo.loading || updateStartDateInfo.loading

  const priceMatch = useMemo(() => {
    if (!selectedOffer.priceMatch) return null

    const priceReduction = formatter.monthlyPrice(selectedOffer.priceMatch.priceReduction)
    const company = selectedOffer.priceMatch.externalInsurer.displayName
    const externalPrice = formatter.monthlyPrice(selectedOffer.priceMatch.externalPrice)

    return {
      title: t('PRICE_MATCH_BUBBLE_SUCCESS_TITLE', { amount: priceReduction }),
      // TODO: Include external expiry date
      children: `${company} · ${externalPrice}`,
    }
  }, [selectedOffer.priceMatch, formatter, t])

  // TODO: Suggested date should be handled by backend
  const startDate = convertToDate(selectedOffer.startDate) ?? new Date()

  return (
    <>
      <form onSubmit={handleSubmitAddToCart}>
        <Space y={2}>
          <Space y={0.5}>
            <Text as="p" align="center" size="xxl">
              {displayPrice}
            </Text>
            <FullWidthButton onClick={onClickEdit}>
              <Text align="center" size="s">
                {t('PRESENT_OFFER_EDIT_BUTTON')}
              </Text>
            </FullWidthButton>

            {priceMatch && <PriceMatchBubble {...priceMatch} />}
          </Space>

          <Space y={0.25}>
            <TierSelector
              offers={priceIntent.offers}
              selectedOfferId={selectedOfferId}
              onValueChange={handleTierSelectorValueChange}
              currencyCode={shopSession.currencyCode}
            />

            <CancellationForm
              option={cancellationOption}
              startDate={startDate}
              onAutoSwitchChange={handleUpdateCancellation}
              onStartDateChange={handleStartDateChange}
            />

            <SubmitButton loading={loading} />
          </Space>
        </Space>
      </form>
      <ScrollPast targetRef={scrollPastRef}>
        <ScrollToButton targetRef={scrollPastRef} type="button">
          <span>{displayPrice}</span>
          <Separator />
          <span>Add to cart</span>
        </ScrollToButton>
      </ScrollPast>
    </>
  )
}

const FullWidthButton = styled.button({ width: '100%', cursor: 'pointer' })

// TODO: Localize
const SubmitButton = ({ loading }: { loading: boolean }) => {
  return (
    <SpaceFlex space={0.5} direction="vertical" align="center">
      <Button disabled={loading}>{loading ? 'Loading...' : 'Add to cart'}</Button>
      <Text size="s" align="center">
        Cancel anytime
      </Text>
    </SpaceFlex>
  )
}

const Separator = styled.div(({ theme }) => ({
  width: 1,
  backgroundColor: theme.colors.gray600,
  margin: `0 ${theme.space[3]}`,
  alignSelf: 'stretch',
}))

type GetCancellationOptionParams = {
  priceIntent: PriceIntent
  productOffer: ProductOfferFragment
}

const getCancellationOption = (params: GetCancellationOptionParams): CancellationOption => {
  const {
    productOffer: { cancellation },
    priceIntent: { externalInsurer },
  } = params

  switch (cancellation.option) {
    case ExternalInsuranceCancellationOption.Iex:
      return {
        type: ExternalInsuranceCancellationOption.Iex,
        companyName: externalInsurer?.displayName ?? 'Unknown',
        requested: cancellation.requested,
      }

    case ExternalInsuranceCancellationOption.Banksignering:
      return {
        type: ExternalInsuranceCancellationOption.Banksignering,
        companyName: externalInsurer?.displayName ?? 'Unknown',
        requested: cancellation.requested,
      }

    case ExternalInsuranceCancellationOption.BanksigneringInvalidStartDate:
      return {
        type: ExternalInsuranceCancellationOption.BanksigneringInvalidStartDate,
        companyName: externalInsurer?.displayName ?? 'Unknown',
      }

    default:
      return { type: ExternalInsuranceCancellationOption.None }
  }
}
