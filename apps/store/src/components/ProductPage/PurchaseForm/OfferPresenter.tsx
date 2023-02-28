import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useInView } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { RefObject, useEffect, useMemo, useRef, useState } from 'react'
import { Button, PlusIcon, Space, Text, theme } from 'ui'
import { useUpdateCancellation } from '@/components/ProductPage/PurchaseForm/useUpdateCancellation'
import { useUpdateStartDate } from '@/components/ProductPage/PurchaseForm/useUpdateStartDate'
import { ScrollPast } from '@/components/ProductPage/ScrollPast/ScrollPast'
import { ScrollToTopButton } from '@/components/ProductPage/ScrollToButton/ScrollToButton'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TierSelector } from '@/components/TierSelector/TierSelector'
import {
  ExternalInsuranceCancellationOption,
  ProductOfferFragment,
} from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useTracking } from '@/services/Tracking/useTracking'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'
import { CancellationForm, CancellationOption } from './CancellationForm/CancellationForm'
import { ComparisonTableContainer } from './ComparisonTableContainer'
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
  const [selectedTypeOfContract, setSelectedTypeOfContract] = useState(
    priceIntent.offers[0].variant.typeOfContract,
  )
  const [isComparisonTableOpen, setIsComparisonTableOpen] = useState(false)

  const selectedOffer = useMemo(() => {
    const newSelectedOffer = priceIntent.offers.find(
      (offer) => offer.variant.typeOfContract === selectedTypeOfContract,
    )

    if (newSelectedOffer) {
      return newSelectedOffer
    }

    datadogLogs.logger.error('Failed to select offer with type of contract', {
      typeOfContract: selectedTypeOfContract,
      priceIntentId: priceIntent.id,
    })
    return priceIntent.offers[0]
  }, [priceIntent.offers, priceIntent.id, selectedTypeOfContract])

  const selectedOfferId = selectedOffer.id

  const handleTierSelectorValueChange = (offerId: string) => {
    const offer = priceIntent.offers.find((offer) => offer.id === offerId)

    if (offer === undefined) {
      datadogLogs.logger.error(`Unknown offer selected: ${offerId}`)
      return
    }

    setSelectedTypeOfContract(offer.variant.typeOfContract)
  }

  const offerRef = useRef(null)
  const tracking = useTracking()
  const isInView = useInView(offerRef, { once: true })
  useEffect(() => {
    if (isInView) {
      tracking.reportViewItem(selectedOffer)
    }
  }, [selectedOffer, tracking, isInView])

  const [updateStartDate, updateStartDateInfo] = useUpdateStartDate({ priceIntent })

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

  const cancellationOption = getCancellationOption({
    priceIntent,
    productOffer: selectedOffer,
  })

  const dateLoading = updateStartDateInfo.loading
  const loading = loadingAddToCart || updateCancellationInfo.loading || dateLoading

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

  const startDate = convertToDate(selectedOffer.startDate) ?? new Date()

  const toggleComparisonTable = () => {
    setIsComparisonTableOpen(!isComparisonTableOpen)
  }

  return (
    <>
      <Space y={1}>
        <form ref={offerRef} onSubmit={handleSubmitAddToCart}>
          <Space y={2}>
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

              {priceMatch && <PriceMatchBubble {...priceMatch} />}
            </Space>

            <Space y={0.25}>
              <TierSelector
                offers={priceIntent.offers}
                selectedOffer={selectedOffer}
                onValueChange={handleTierSelectorValueChange}
                currencyCode={shopSession.currencyCode}
              />

              <CancellationForm
                option={cancellationOption}
                startDate={startDate}
                onAutoSwitchChange={handleUpdateCancellation}
                onStartDateChange={(startDate) => updateStartDate({ dateValue: startDate })}
              />

              <SubmitButton loading={loading} />
            </Space>
          </Space>
        </form>
        {priceIntent.offers.length > 1 && (
          <SpaceFlex direction="vertical" align="center">
            <Button variant="ghost" size="small" onClick={toggleComparisonTable}>
              <SpaceFlex space={0.5} align="center">
                <PlusIcon transform={isComparisonTableOpen ? 'rotate(-45)' : 'rotate(0)'} />
                {t('COMPARE_COVERAGE_BUTTON')}
              </SpaceFlex>
            </Button>
          </SpaceFlex>
        )}

        {isComparisonTableOpen && (
          <ComparisonTableContainer offers={priceIntent.offers} selectedOfferId={selectedOfferId} />
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
    borderRadius: theme.radius.xs,
    boxShadow: `${theme.colors.light} 0 0 0 3px, ${theme.colors.textPrimary} 0 0 0 4px`,
  },

  '@media (hover: hover)': {
    ':hover > span': {
      color: theme.colors.textPrimary,
    },
  },
})

const SubmitButton = ({ loading }: { loading: boolean }) => {
  const { t } = useTranslation('purchase-form')

  return (
    <SpaceFlex space={0.5} direction="vertical" align="center">
      <Button disabled={loading} loading={loading}>
        {t('ADD_TO_CART_BUTTON_LABEL')}
      </Button>
    </SpaceFlex>
  )
}

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

    case ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate:
      return {
        type: ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate,
        companyName: externalInsurer?.displayName ?? 'Unknown',
      }

    default:
      return { type: ExternalInsuranceCancellationOption.None }
  }
}
