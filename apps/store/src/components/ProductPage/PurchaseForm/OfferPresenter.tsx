import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useInView } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { RefObject, useEffect, useMemo, useRef, useState } from 'react'
import { Button, CrossIcon, Space, Text, theme } from 'ui'
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
import { useTracking } from '@/services/Tracking/useTracking'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'
import { CancellationForm, CancellationOption } from './CancellationForm/CancellationForm'
import * as ComparisonTable from './ComparisonTable/ComparisonTable'
import { PriceMatchBubble } from './PriceMatchBubble/PriceMatchBubble'
import { useHandleSubmitAddToCart } from './useHandleSubmitAddToCart'
import { useUpdateRenewalDate } from './useUpdateRenewalDate'

const removeDuplicates = <T,>(arr: T[]): T[] => Array.from(new Set(arr))

type Props = {
  priceIntent: PriceIntent
  shopSession: ShopSession
  scrollPastRef: RefObject<HTMLElement>
  // TODO: Use better type
  onAddedToCart: (productOffer: ProductOfferFragment) => void
  onClickEdit: () => void
}

const offerHasPeril = (offer: ProductOfferFragment, perilTitle: string) =>
  offer.variant.perils.some((peril) => peril.title === perilTitle)

//@TODO - base on selected offer
const isSelectedOffer = (offer: ProductOfferFragment, selectedOfferId: string) => {
  if (offer.id === selectedOfferId) return true
  return false
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
  const [updateRenewalDate, updateRenewalDateInfo] = useUpdateRenewalDate({ priceIntent })

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

  const dateLoading = updateStartDateInfo.loading || updateRenewalDateInfo.loading
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
  const renewalDate = convertToDate(selectedOffer.cancellation.existingInsuranceRenewalDate)

  const toggleComparisonTable = () => {
    setIsComparisonTableOpen(!isComparisonTableOpen)
  }

  const getUniquePerilTitles = () => {
    const allPerils = priceIntent.offers.flatMap((offer) => offer.variant.perils)
    const perilTitles = allPerils.map((peril) => peril.title)
    return removeDuplicates(perilTitles)
  }

  return (
    <>
      <Space y={1}>
        <form ref={offerRef} onSubmit={handleSubmitAddToCart}>
          <Space y={2}>
            <Space y={0.5}>
              <Text as="p" align="center" size="xxl">
                {displayPrice}
              </Text>
              <Centered>
                <TextButton onClick={onClickEdit}>
                  <Text align="center" size="xs">
                    {t('PRESENT_OFFER_EDIT_BUTTON')}
                  </Text>
                </TextButton>
              </Centered>

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
                renewalDate={renewalDate ?? undefined}
                onAutoSwitchChange={handleUpdateCancellation}
                onStartDateChange={(startDate) => updateStartDate({ dateValue: startDate })}
                onRenewalDateChange={(renewalDate) => updateRenewalDate({ dateValue: renewalDate })}
              />

              <SubmitButton loading={loading} />
            </Space>
          </Space>
        </form>
        {priceIntent.offers.length > 1 && (
          <SpaceFlex direction="vertical" align="center">
            <Button variant="ghost" size="small" onClick={toggleComparisonTable}>
              <StyledCrossIcon
                transform={isComparisonTableOpen ? 'rotate(0)' : 'rotate(-45)'}
                size="0.875rem"
              />
              {t('COMPARE_COVERAGE_BUTTON')}
            </Button>
          </SpaceFlex>
        )}

        {isComparisonTableOpen && (
          <ComparisonTable.Root>
            <ComparisonTable.Head>
              <ComparisonTable.Header />
              {priceIntent.offers.map((offer) => (
                <ComparisonTable.Header
                  key={offer.id}
                  active={isSelectedOffer(offer, selectedOfferId)}
                >
                  {/* @TODO - fix short names for header */}
                  {offer.variant.displayName}Trafik
                </ComparisonTable.Header>
              ))}
            </ComparisonTable.Head>
            <ComparisonTable.Body>
              {getUniquePerilTitles().map((perilTitle) => (
                <ComparisonTable.Row key={perilTitle}>
                  <ComparisonTable.TitleDataCell>{perilTitle}</ComparisonTable.TitleDataCell>
                  {priceIntent.offers.map((offer) => (
                    <ComparisonTable.DataCell
                      key={offer.id}
                      active={isSelectedOffer(offer, selectedOfferId)}
                    >
                      {offerHasPeril(offer, perilTitle) ? (
                        <ComparisonTable.CheckIcon />
                      ) : (
                        <ComparisonTable.MissingIcon />
                      )}
                    </ComparisonTable.DataCell>
                  ))}
                </ComparisonTable.Row>
              ))}
            </ComparisonTable.Body>
          </ComparisonTable.Root>
        )}
      </Space>
      <ScrollPast targetRef={scrollPastRef}>
        <ScrollToButton targetRef={scrollPastRef} type="button">
          <ScrollPastButtonContent>
            <span>{displayPrice}</span>
            <Separator />
            <span>{t('ADD_TO_CART_BUTTON_LABEL')}</span>
          </ScrollPastButtonContent>
        </ScrollToButton>
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

  backgroundColor: theme.colors.light,
  ':focus-visible': {
    borderRadius: theme.radius.xs,
    boxShadow: `${theme.colors.light} 0 0 0 3px, ${theme.colors.textPrimary} 0 0 0 4px`,
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

const StyledCrossIcon = styled(CrossIcon)({
  marginRight: theme.space.xxs,
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

    case ExternalInsuranceCancellationOption.BanksigneringInvalidStartDate:
      return {
        type: ExternalInsuranceCancellationOption.BanksigneringInvalidStartDate,
        companyName: externalInsurer?.displayName ?? 'Unknown',
      }

    default:
      return { type: ExternalInsuranceCancellationOption.None }
  }
}
