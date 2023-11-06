import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Space } from 'ui'
import { ProductOfferFragment, TrialContractFragment } from '@/services/apollo/generated'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { convertToDate } from '@/utils/date'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
import { ConfirmPayWithoutExtensionButton } from './ConfirmPayWithoutExtensionButton'
import { ExtensionOfferToggle } from './ExtensionOfferToggle'
import { PriceBreakdown } from './PriceBreakdown'
import { ProductItemContractContainerCar } from './ProductItemContractContainer'

type Props = {
  trialContract: TrialContractFragment
  shopSessionId: string
  defaultOffer?: ProductOfferFragment
  ssn?: string
}

export const PayForTrial = ({ trialContract, shopSessionId, defaultOffer, ssn }: Props) => {
  const router = useRouter()
  const { t } = useTranslation('carDealership')
  const formatter = useFormatter()
  const { startLogin } = useBankIdContext()
  const handleConfirmPay = () => {
    datadogRum.addAction('Car dealership | Decline extension offer')

    if (!ssn) {
      throw new Error('Must have customer ssn')
    }

    startLogin({
      ssn,
      async onSuccess() {
        console.log('Car dealership | BankID login success')
        const nextUrl = PageLink.carDealershipConfirmationWithoutExtension({
          contractId: trialContract.id,
        }).pathname
        await router.push(
          PageLink.checkoutPaymentTrustly({ shopSessionId: shopSessionId, nextUrl }).href,
        )
      },
    })
  }

  const trialTerminationDate = convertToDate(trialContract.terminationDate)
  if (!trialTerminationDate) {
    throw new Error(`Unable to parse terminationDate: ${trialContract.terminationDate}`)
  }

  return (
    <Space y={1}>
      <ProductItemContractContainerCar contract={trialContract} />

      <ExtensionOfferToggle />

      <PriceBreakdown
        amount={trialContract.premium.amount}
        crossedOverAmount={defaultOffer?.cost.net.amount}
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

      <ConfirmPayWithoutExtensionButton onConfirm={handleConfirmPay} />
    </Space>
  )
}
