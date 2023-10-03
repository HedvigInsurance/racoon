import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'
import { TextProps } from 'ui/src/components/Text/Text'
import { Space, Button, RestartIcon, Text, BankIdIcon } from 'ui'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { TotalAmount } from '@/components/ShopBreakdown/TotalAmount'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TextWithLink } from '@/components/TextWithLink'
import { WithLink } from '@/components/TextWithLink'
import { AttentionToastBar, InfoToastBar } from '@/components/ToastBar/ToastBar'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { convertToDate } from '@/utils/date'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { ActionButtonsCar } from './ActionButtonsCar'
import { type TrialExtension } from './carDealershipFixtures'
import { ProductItemContractContainerCar } from './ProductItemContractContainer'
import { useSignAndPay } from './useSignAndPay'

type Props = {
  contract: TrialExtension['trialContract']
  priceIntent: TrialExtension['priceIntent']
  shopSession: TrialExtension['shopSession']
  requirePaymentConnection: boolean
}

export const TrialExtensionForm = (props: Props) => {
  const { t } = useTranslation(['carDealership', 'checkout'])
  const [userWantsExtension, setUserWantsExtension] = useState(true)
  const { routingLocale } = useCurrentLocale()
  const { signAndPay, loading } = useSignAndPay({
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

  const handleUndo = () => {
    datadogRum.addAction('Car dealership | Undo remove')
    setUserWantsExtension(true)
  }

  const handleSignAndPay = () => {
    datadogRum.addAction('Car dealership | Sign and pay')
    signAndPay(selectedOffer.id)
  }

  const router = useRouter()
  const { startLogin } = useBankIdContext()
  const handleClickPay = () => {
    datadogRum.addAction('Car dealership | BankID login')
    const ssn = props.shopSession.customer?.ssn
    if (!ssn) throw new Error('Car dealership | No SSN in Shop Session')

    startLogin({
      ssn,
      async onSuccess() {
        console.log('Car dealership | BankID login success')
        await router.push(PageLink.paymentConnect())
      },
    })
  }

  if (!userWantsExtension) {
    return (
      <Space y={4}>
        <TrialOffer
          contract={props.contract}
          requirePaymentConnection={props.requirePaymentConnection}
        />

        <Space y={1.5}>
          <Text align="center">{t('EXTENSION_HEADING')}</Text>
          <Space y={2}>
            <Space y={1}>
              <Space y={0.75}>
                <Button variant="secondary" onClick={handleUndo}>
                  <SpaceFlex direction="horizontal" space={0.5}>
                    <StyledRestartIcon />
                    {t('UNDO_REMOVE_EXTENSION_BUTTON')}
                  </SpaceFlex>
                </Button>

                <AttentionToastBar>
                  <ReplaceText color="textPrimary" size="xs" text="1 November 2023" as="span">
                    {t('ATTENTION_TOAST_CONTENT')}
                  </ReplaceText>
                </AttentionToastBar>
              </Space>

              <TotalAmount {...props.contract.premium} />
            </Space>
            <Button variant="primary" onClick={handleClickPay}>
              <SpaceFlex space={0.5} align="center">
                <BankIdIcon />
                {t('CONNECT_PAYMENT_BUTTON')}
              </SpaceFlex>
            </Button>
          </Space>
        </Space>
      </Space>
    )
  }

  return (
    <Space y={4}>
      <TrialOffer
        contract={props.contract}
        requirePaymentConnection={props.requirePaymentConnection}
      />

      <Space y={1.5}>
        <Text align="center">{t('EXTENSION_HEADING')}</Text>
        <Space y={2}>
          <Space y={1}>
            <ProductItemContainer
              offer={selectedOffer}
              defaultExpanded={true}
              variant={props.requirePaymentConnection ? 'green' : undefined}
            >
              <ActionButtonsCar
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
          </Space>
          <Space y={0.5}>
            <InfoToastBar>
              <WithLink href={PageLink.apiAppStoreRedirect()} target="_blank">
                {t('INFO_TOAST_CONTENT')}
              </WithLink>
            </InfoToastBar>

            <Space y={1}>
              <Button onClick={handleSignAndPay} loading={loading}>
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
    </Space>
  )
}

type TrialOfferProps = {
  contract: TrialExtension['trialContract']
  requirePaymentConnection: boolean
}

const TrialOffer = (props: TrialOfferProps) => {
  const { t } = useTranslation('carDealership')

  if (!props.requirePaymentConnection) return null

  return (
    <Space y={1.5}>
      <Text align="center">{t('TRIAL_HEADING')}</Text>
      <ProductItemContractContainerCar contract={props.contract} />
    </Space>
  )
}

const StyledRestartIcon = styled(RestartIcon)({
  // Optically align RestartIcon
  position: 'relative',
  top: 2,
})

type ReplaceTextProps = TextProps & {
  text: string
  children: string
}

const ReplaceText = ({ text, children, ...props }: ReplaceTextProps) => {
  const placeholder = '{}'
  const [before, after] = children.split(placeholder, 2)
  return (
    <>
      {before}
      <Text {...props}>{text}</Text>
      {after}
    </>
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
