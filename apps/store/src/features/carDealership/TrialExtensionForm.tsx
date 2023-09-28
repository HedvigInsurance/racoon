import { datadogRum } from '@datadog/browser-rum'
import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'
import { TextProps } from 'ui/src/components/Text/Text'
import { Space, Button, RestartIcon, Text, BankIdIcon } from 'ui'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { TotalAmount } from '@/components/ShopBreakdown/TotalAmount'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { AttentionToastBar, InfoToastBar } from '@/components/ToastBar/ToastBar'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { convertToDate } from '@/utils/date'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
import { ActionButtonsCar } from './ActionButtonsCar'
import { type TrialExtension } from './carDealershipFixtures'
import { ProductItemContractContainerCar } from './ProductItemContractContainer'
import { useSignAndPay } from './useSignAndPay'

const SIGN_AND_PAY_BUTTON = 'Sign and pay'
const SIGN_BUTTON = 'Sign insurance'
const CONTINUE_WITHOUT_EXTENSION_BUTTON = 'Connect payment'
const INFO_TOAST_CONTENT = 'Se allt om din prova på-försäkring i Hedvig-appen.'
const UNDO_REMOVE_BUTTON = 'Undo removal'
const COST_EXPLANATION = 'discounted price until {}'
const ATTENTION_CARD_CONTENT = 'Keep in mind that you are uninsured from {}'
const TRIAL_HEADING = 'Starter offer'
const EXTENSION_HEADING = 'Extend your insurance'

type Props = {
  contract: TrialExtension['trialContract']
  priceIntent: TrialExtension['priceIntent']
  shopSession: TrialExtension['shopSession']
  requirePaymentConnection: boolean
}

export const TrialExtensionForm = (props: Props) => {
  const [userWantsExtension, setUserWantsExtension] = useState(true)
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

  const formatter = useFormatter()
  const terminationDate = convertToDate(props.contract.terminationDate)
  if (!terminationDate) {
    throw new Error(`Unable to parse terminationDate: ${props.contract.terminationDate}`)
  }
  const costExplanation = COST_EXPLANATION.replace('{}', formatter.fromNow(terminationDate))

  const handleUpdate = (tierLevel: string) => {
    const match = props.priceIntent.offers.find((item) => item.variant.typeOfContract === tierLevel)
    if (!match) {
      throw new Error(`Unable to find offer with tierLevel ${tierLevel}`)
    }

    setTierLevel(tierLevel)
  }

  const handleRemove = () => {
    datadogRum.addAction('Car dealership | Remove')
    setUserWantsExtension(false)
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
        <Space y={1.5}>
          <Text align="center">{TRIAL_HEADING}</Text>
          <ProductItemContractContainerCar contract={props.contract} />
        </Space>

        <Space y={1.5}>
          <Text align="center">{EXTENSION_HEADING}</Text>
          <Space y={2}>
            <Space y={1}>
              <Space y={0.75}>
                <Button variant="secondary" onClick={handleUndo}>
                  <SpaceFlex direction="horizontal" space={0.5}>
                    <RestartIcon />
                    {UNDO_REMOVE_BUTTON}
                  </SpaceFlex>
                </Button>

                <AttentionToastBar>
                  <ReplaceText color="textPrimary" size="xs" text="1 November 2023" as="span">
                    {ATTENTION_CARD_CONTENT}
                  </ReplaceText>
                </AttentionToastBar>
              </Space>

              <TotalAmount
                amount={props.contract.premium.amount}
                currencyCode={props.contract.premium.currencyCode}
              />
            </Space>
            <Button variant="primary" onClick={handleClickPay}>
              <SpaceFlex space={0.5} align="center">
                <BankIdIcon />
                {CONTINUE_WITHOUT_EXTENSION_BUTTON}
              </SpaceFlex>
            </Button>
          </Space>
        </Space>
      </Space>
    )
  }

  return (
    <Space y={4}>
      <Space y={1.5}>
        <Text align="center">{TRIAL_HEADING}</Text>
        <ProductItemContractContainerCar contract={props.contract} />
      </Space>

      <Space y={1.5}>
        <Text align="center">{EXTENSION_HEADING}</Text>

        <Space y={2}>
          <Space y={1}>
            <ProductItemContainer offer={selectedOffer} defaultExpanded={true} variant="green">
              <ActionButtonsCar
                priceIntent={props.priceIntent}
                offer={selectedOffer}
                onRemove={handleRemove}
                onUpdate={handleUpdate}
              />
            </ProductItemContainer>

            <TotalAmount
              amount={selectedOffer.cost.net.amount}
              currencyCode={props.contract.premium.currencyCode}
              discount={{
                reducedAmount: props.contract.premium.amount,
                explanation: costExplanation,
              }}
            />
          </Space>
          <Space y={0.5}>
            <InfoToastBar>{INFO_TOAST_CONTENT}</InfoToastBar>

            <Button onClick={handleSignAndPay} loading={loading}>
              <SpaceFlex space={0.5} align="center">
                <BankIdIcon />
                {props.requirePaymentConnection ? SIGN_AND_PAY_BUTTON : SIGN_BUTTON}
              </SpaceFlex>
            </Button>
          </Space>
        </Space>
      </Space>
    </Space>
  )
}

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
