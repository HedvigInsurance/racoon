import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import type { ComponentPropsWithoutRef } from 'react'
import { useMemo, useState } from 'react'
import { BankIdIcon, Button, CheckIcon, Space, Text, Divider, theme } from 'ui'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { TotalAmount } from '@/components/ShopBreakdown/TotalAmount'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TextWithLink } from '@/components/TextWithLink'
import type {
  PriceIntentCarTrialExtensionFragment,
  ProductOfferFragment,
  ShopSessionFragment,
} from '@/services/graphql/generated'
import { convertToDate } from '@/utils/date'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
import { type TrialContract } from '../carDealership.types'
import { ExtensionOfferToggle } from '../ExtensionOfferToggle'
import { PriceBreakdown } from '../PriceBreakdown'
import { ProductItemContractContainerCar } from '../ProductItemContractContainer'
import { EditActionButton } from './EditActionButton'
import { useAcceptExtension } from './useAcceptExtension'

type Props = {
  trialContract: TrialContract
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
  const locale = useRoutingLocale()
  const formatter = useFormatter()

  const [acceptExtension, loading] = useAcceptExtension({
    shopSession: shopSession,
    trialContractId: trialContract.id,
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
  const extensionActivationDate = convertToDate(selectedOffer.startDate)
  if (!extensionActivationDate) {
    throw new Error(`Start date must be defined for offer  ${selectedOffer.id}`)
  }

  const trialTerminationDate = convertToDate(trialContract.terminationDate)
  if (!trialTerminationDate) {
    throw new Error(`Unable to parse terminationDate: ${trialContract.terminationDate}`)
  }

  const defaultOfferCost = priceIntent.defaultOffer?.cost.net

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

  const signButtonLabel = requirePaymentConnection ? t('SIGN_AND_PAY_BUTTON') : t('SIGN_BUTTON')

  return (
    <Space y={1}>
      {requirePaymentConnection && (
        <>
          <ProductItemContractContainerCar
            contract={trialContract}
            crossedOutAmount={defaultOfferCost}
          />
          <ExtensionOfferToggle />
        </>
      )}

      <Space y={1}>
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

        {requirePaymentConnection ? (
          <>
            <PriceBreakdown
              amount={trialContract.premium.amount}
              crossedOutAmount={defaultOfferCost?.amount}
              currencyCode={trialContract.premium.currencyCode}
              title={t('TRIAL_TITLE')}
              subTitle={trialContract.productVariant.displayNameSubtype}
              priceExplanation={t('TRIAL_COST_EXPLANATION', {
                date: formatter.dateFull(trialTerminationDate, {
                  hideYear: true,
                  abbreviateMonth: true,
                }),
              })}
            />

            <Divider />

            <PriceBreakdown
              amount={selectedOffer.cost.net.amount}
              currencyCode={selectedOffer.cost.net.currencyCode}
              title={t('EXTENSION_TITLE')}
              subTitle={selectedOffer.variant.displayNameSubtype}
              priceExplanation={t('EXTENSION_COST_EXPLANATION', {
                date: formatter.dateFull(extensionActivationDate, {
                  hideYear: true,
                  abbreviateMonth: true,
                }),
              })}
            />
          </>
        ) : (
          <TotalAmount
            amount={selectedOffer.cost.net.amount}
            currencyCode={selectedOffer.cost.net.currencyCode}
          />
        )}

        <Space y={1}>
          <SignButton onClick={handleClickSign} loading={loading}>
            {signButtonLabel}
          </SignButton>

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
            href={PageLink.privacyPolicy({ locale })}
            target="_blank"
          >
            {t('checkout:SIGN_DISCLAIMER')}
          </TextWithLink>
        </Space>
      </Space>
    </Space>
  )
}

type SignButtonProps = ComponentPropsWithoutRef<typeof Button>
const SignButton = ({ children, ...props }: SignButtonProps) => {
  return (
    <Button fullWidth={true} {...props}>
      <SpaceFlex space={0.5} align="center">
        <BankIdIcon />
        {children}
      </SpaceFlex>
    </Button>
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
