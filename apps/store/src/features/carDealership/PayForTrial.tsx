import { datadogRum } from '@datadog/browser-rum'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Space } from 'ui'
import { useDismissBanner } from '@/components/GlobalBanner/globalBannerState'
import { CarDealershipBanners } from '@/features/carDealership/carDearlership.constants'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import type { ProductOfferFragment } from '@/services/graphql/generated'
import { convertToDate } from '@/utils/date'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
import { type TrialContract } from './carDealership.types'
import { ConfirmPayWithoutExtensionButton } from './ConfirmPayWithoutExtensionButton'
import { ExtensionOfferToggle } from './ExtensionOfferToggle'
import { PriceBreakdown } from './PriceBreakdown'
import { ProductItemContractContainerCar } from './ProductItemContractContainer'

type Props = {
  trialContract: TrialContract
  shopSessionId: string
  defaultOffer?: ProductOfferFragment
  ssn?: string
}

export const PayForTrial = ({ trialContract, shopSessionId, defaultOffer, ssn }: Props) => {
  const router = useRouter()
  const { t } = useTranslation('carDealership')
  const formatter = useFormatter()
  const locale = useRoutingLocale()
  const dismissBanner = useDismissBanner()
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
        const nextUrl = PageLink.carDealershipConfirmation({
          locale,
          contractId: trialContract.id,
        }).pathname
        dismissBanner(CarDealershipBanners.ConnectPayment)
        await router.push(
          PageLink.checkoutPaymentTrustly({ locale, shopSessionId: shopSessionId, nextUrl }),
        )
      },
    })
  }

  const trialTerminationDate = convertToDate(trialContract.terminationDate)
  if (!trialTerminationDate) {
    throw new Error(`Unable to parse terminationDate: ${trialContract.terminationDate}`)
  }

  const crossedOutAmount = defaultOffer?.cost.net

  return (
    <Space y={1}>
      <ProductItemContractContainerCar
        contract={trialContract}
        crossedOutAmount={crossedOutAmount}
      />

      <ExtensionOfferToggle />

      <PriceBreakdown
        amount={trialContract.premium.amount}
        crossedOutAmount={crossedOutAmount?.amount}
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
