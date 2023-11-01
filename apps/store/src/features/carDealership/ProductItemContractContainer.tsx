import { useTranslation } from 'next-i18next'
import { ProductItem } from '@/components/ProductItem/ProductItem'
import { TrialContractFragment } from '@/services/apollo/generated'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  contract: TrialContractFragment
}

export const ProductItemContractContainerCar = ({ contract }: Props) => {
  const formatter = useFormatter()
  const { t } = useTranslation('carDealership')

  console.log('contract', contract)

  // TODO: displayItems is failing in carTrialExtensionQuery
  const productDetails = [
    {
      title: 'Registration number',
      value: 'ABC 123',
    },
  ]

  const productDocuments = contract.currentAgreement.productVariant.documents.map((item) => ({
    title: item.displayName,
    url: item.url,
  }))

  const endDate = convertToDate(contract.currentAgreement.activeTo)
  if (endDate === null) throw new Error(`Invalid end date for contract ${contract.id}`)

  const startDateProps = {
    label: t('TRIAL_TERMINATION_DATE_MESSAGE', {
      date: formatter.dateFull(endDate, { abbreviateMonth: true }),
    }),
    tooltip: t('TRIAL_TERMINATION_DATE_TOOLTIP'),
  }

  return (
    <ProductItem
      title={contract.currentAgreement.productVariant.displayName}
      price={contract.currentAgreement.premium}
      startDate={startDateProps}
      productDetails={productDetails}
      productDocuments={productDocuments}
      badge={{ children: t('CONTRACT_CARD_BADGE'), color: 'signalAmberHighlight' }}
      exposure={contract.exposureDisplayName}
    />
  )
}
