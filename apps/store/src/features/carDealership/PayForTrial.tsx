import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Space } from 'ui'
import { TotalAmount } from '@/components/ShopBreakdown/TotalAmount'
import { WithLink } from '@/components/TextWithLink'
import { AttentionToastBar } from '@/components/ToastBar/ToastBar'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { PageLink } from '@/utils/PageLink'
import { type TrialExtension } from './carDealershipFixtures'
import { ConfirmPayWithoutExtensionButton } from './ConfirmPayWithoutExtensionButton'
import { ExtensionOfferToggle } from './ExtensionOfferToggle'
import { ProductItemContractContainerCar } from './ProductItemContractContainer'

type Props = {
  contract: TrialExtension['trialContract']
  ssn: string
}

export const PayForTrial = (props: Props) => {
  const { t } = useTranslation(['carDealership', 'checkout'])

  const router = useRouter()
  const { startLogin } = useBankIdContext()
  const handleConfirmPay = () => {
    datadogRum.addAction('Car dealership | Decline extension offer')

    startLogin({
      ssn: props.ssn,
      async onSuccess() {
        console.log('Car dealership | BankID login success')
        await router.push(PageLink.paymentConnect())
      },
    })
  }

  return (
    <Space y={1}>
      <ProductItemContractContainerCar contract={props.contract} />

      <ExtensionOfferToggle />

      <TotalAmount {...props.contract.premium} />
      <AttentionToastBar>
        <WithLink href={PageLink.apiAppStoreRedirect()} target="_blank">
          {t('NOTICE_TOAST_CONTENT')}
        </WithLink>
      </AttentionToastBar>
      <ConfirmPayWithoutExtensionButton onConfirm={handleConfirmPay} />
    </Space>
  )
}
