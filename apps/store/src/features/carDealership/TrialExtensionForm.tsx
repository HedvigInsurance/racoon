import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useState, useMemo } from 'react'
import { Space, Button, Text, BankIdIcon, CheckIcon, theme } from 'ui'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { TotalAmount } from '@/components/ShopBreakdown/TotalAmount'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TextWithLink } from '@/components/TextWithLink'
import {
  PriceIntentCarTrialExtensionFragment,
  ProductOfferFragment,
  ShopSessionFragment,
  TrialContractFragment,
} from '@/services/apollo/generated'
import { convertToDate } from '@/utils/date'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
import { EditActionButton } from './EditActionButton'
import { ExtensionOfferToggle } from './ExtensionOfferToggle'
import { ProductItemContractContainerCar } from './ProductItemContractContainer'
import { useAcceptExtension } from './useAcceptExtension'

type Props = {
  trialContract: TrialContractFragment
  priceIntent: PriceIntentCarTrialExtensionFragment
  shopSession: ShopSessionFragment
  requirePaymentConnection: boolean
}

export const TrialExtensionForm = ({
  trialContract,
  priceIntent,
  shopSession,
  requirePaymentConnection,
}: Props) => {
  const { t } = useTranslation(['carDealership', 'checkout'])
  const { routingLocale } = useCurrentLocale()
  const formatter = useFormatter()
  const [acceptExtension, loading] = useAcceptExtension({
    shopSession: shopSession,
    requirePaymentConnection: requirePaymentConnection,
  })

  const [tierLevel, setTierLevel] = useState<string>(() => {
    return (
      priceIntent.defaultOffer?.variant.typeOfContract ??
      priceIntent.offers[0].variant.typeOfContract
    )
  })
  const selectedOffer = useMemo(
    () => getSelectedOffer(priceIntent, tierLevel),
    [priceIntent, tierLevel],
  )
  const activationDate = convertToDate(selectedOffer.startDate)
  if (activationDate === null) {
    throw new Error(`Start date must be defined for offer  ${selectedOffer.id}`)
  }

  const terminationDate = convertToDate(trialContract.terminationDate)
  if (!terminationDate) {
    throw new Error(`Unable to parse terminationDate: ${trialContract.terminationDate}`)
  }

  const handleUpdate = (tierLevel: string) => {
    const match = priceIntent.offers.find((item) => item.variant.typeOfContract === tierLevel)
    if (!match) {
      throw new Error(`Unable to find offer with tierLevel ${tierLevel}`)
    }

    setTierLevel(tierLevel)
  }

  const handleClickSign = () => {
    datadogRum.addAction('Car dealership | Click Sign')
    acceptExtension(selectedOffer.id)
  }

  return (
    <Space y={1}>
      {requirePaymentConnection && (
        <>
          <ProductItemContractContainerCar contract={trialContract} />
          <ExtensionOfferToggle />
        </>
      )}

      <Space y={1.5}>
        <ProductItemContainer
          offer={selectedOffer}
          defaultExpanded={true}
          variant={requirePaymentConnection ? 'green' : undefined}
        >
          <EditActionButton
            priceIntent={priceIntent}
            offer={selectedOffer}
            onUpdate={handleUpdate}
          />
        </ProductItemContainer>

        <TotalAmount
          {...selectedOffer.cost.net}
          {...(requirePaymentConnection && {
            discount: {
              reducedAmount: trialContract.currentAgreement.premium.amount,
              explanation: t('TRIAL_COST_EXPLANATION', {
                date: formatter.dateFull(activationDate, { hideYear: true, abbreviateMonth: true }),
              }),
            },
          })}
        />

        <Space y={1}>
          <Button onClick={handleClickSign} loading={loading}>
            <SpaceFlex space={0.5} align="center">
              <BankIdIcon />
              {requirePaymentConnection ? t('SIGN_AND_PAY_BUTTON') : t('SIGN_BUTTON')}
            </SpaceFlex>
          </Button>

          <UspWrapper>
            <CheckIcon size="1rem" />
            <Text size="xs">{t('USP_TEXT')}</Text>
          </UspWrapper>

          <TextWithLink
            as="p"
            size="xs"
            align="center"
            balance={true}
            color="textSecondary"
            href={PageLink.privacyPolicy({ locale: routingLocale })}
            target="_blank"
          >
            {t('checkout:SIGN_DISCLAIMER')}
          </TextWithLink>
        </Space>
      </Space>
    </Space>
  )
}

const UspWrapper = styled.div({
  height: '2.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.xs,
})

const getSelectedOffer = (
  priceIntent: PriceIntentCarTrialExtensionFragment,
  selectedTierLevel: string,
) => {
  const matchedSelectedOffer = getOfferByTierLevel(priceIntent.offers, selectedTierLevel)
  if (matchedSelectedOffer) {
    return matchedSelectedOffer
  }

  if (priceIntent.defaultOffer) {
    const matchedDefaultOffer = getOfferByTierLevel(
      priceIntent.offers,
      priceIntent.defaultOffer.variant.typeOfContract,
    )
    if (matchedDefaultOffer) {
      return matchedDefaultOffer
    }
  }

  return priceIntent.offers[0]
}

const getOfferByTierLevel = (offers: Array<ProductOfferFragment>, tierLevel: string) => {
  return offers.find((offer) => offer.variant.typeOfContract === tierLevel)
}
