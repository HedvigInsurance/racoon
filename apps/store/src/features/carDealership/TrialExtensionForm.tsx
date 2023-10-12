import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { useState, useMemo } from 'react'
import { Space, Button, Text, BankIdIcon } from 'ui'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { TotalAmount } from '@/components/ShopBreakdown/TotalAmount'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TextWithLink } from '@/components/TextWithLink'
import { WithLink } from '@/components/TextWithLink'
import { InfoToastBar } from '@/components/ToastBar/ToastBar'
import { convertToDate } from '@/utils/date'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { type TrialExtension } from './carDealershipFixtures'
import { EditActionButton } from './EditActionButton'
import { ExtensionOfferToggle } from './ExtensionOfferToggle'
import { ProductItemContractContainerCar } from './ProductItemContractContainer'
import { useAcceptExtension } from './useAcceptExtension'

type Props = {
  contract: TrialExtension['trialContract']
  priceIntent: TrialExtension['priceIntent']
  shopSession: TrialExtension['shopSession']
  requirePaymentConnection: boolean
}

export const TrialExtensionForm = (props: Props) => {
  const { t } = useTranslation(['carDealership', 'checkout'])
  const { routingLocale } = useCurrentLocale()
  const [acceptExtension, loading] = useAcceptExtension({
    shopSession: props.shopSession,
    requirePaymentConnection: props.requirePaymentConnection,
  })

  const [tierLevel, setTierLevel] = useState<string>(() => {
    return (
      props.priceIntent.defaultOffer?.variant.typeOfContract ??
      props.priceIntent.offers[0].variant.typeOfContract
    )
  })
  const selectedOffer = useMemo(
    () => getSelectedOffer(props.priceIntent, tierLevel),
    [props.priceIntent, tierLevel],
  )

  const terminationDate = convertToDate(props.contract.terminationDate)
  if (!terminationDate) {
    throw new Error(`Unable to parse terminationDate: ${props.contract.terminationDate}`)
  }

  const handleUpdate = (tierLevel: string) => {
    const match = props.priceIntent.offers.find((item) => item.variant.typeOfContract === tierLevel)
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
      {props.requirePaymentConnection && (
        <Space y={1.5}>
          <Text align="center">{t('TRIAL_HEADING')}</Text>
          <ProductItemContractContainerCar contract={props.contract} />
        </Space>
      )}

      <ExtensionOfferToggle />

      <Space y={1.5}>
        <ProductItemContainer
          offer={selectedOffer}
          defaultExpanded={true}
          variant={props.requirePaymentConnection ? 'green' : undefined}
        >
          <EditActionButton
            priceIntent={props.priceIntent}
            offer={selectedOffer}
            onUpdate={handleUpdate}
          />
        </ProductItemContainer>

        <TotalAmount
          {...selectedOffer.cost.net}
          {...(props.requirePaymentConnection && {
            discount: {
              reducedAmount: props.contract.premium.amount,
              explanation: t('TRIAL_COST_EXPLANATION'),
            },
          })}
        />

        <Space y={0.5}>
          <InfoToastBar>
            <WithLink href={PageLink.apiAppStoreRedirect()} target="_blank">
              {t('INFO_TOAST_CONTENT')}
            </WithLink>
          </InfoToastBar>

          <Space y={1}>
            <Button onClick={handleClickSign} loading={loading}>
              <SpaceFlex space={0.5} align="center">
                <BankIdIcon />
                {props.requirePaymentConnection ? t('SIGN_AND_PAY_BUTTON') : t('SIGN_BUTTON')}
              </SpaceFlex>
            </Button>

            <TextWithLink
              as="p"
              size={{ _: 'xs', md: 'sm' }}
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
    </Space>
  )
}

const getSelectedOffer = (
  priceIntent: TrialExtension['priceIntent'],
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

const getOfferByTierLevel = (
  offers: TrialExtension['priceIntent']['offers'],
  tierLevel: string,
) => {
  return offers.find((offer) => offer.variant.typeOfContract === tierLevel)
}
