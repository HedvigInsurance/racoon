import { useTranslation } from 'next-i18next'
import { ProductItem } from '@/components/ProductItem/ProductItem'
import { Money, TrialContractFragment } from '@/services/apollo/generated'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  contract: TrialContractFragment
  crossedOverAmount?: Money
}

export const ProductItemContractContainerCar = ({ contract, crossedOverAmount }: Props) => {
  const formatter = useFormatter()
  const { t } = useTranslation('carDealership')

  const productDetails = contract.displayItems.map((item) => ({
    title: item.displayTitle,
    value: item.displayValue,
  }))

  // Only show crossed over amount if default offer is more expensive than the trial
  const showCrossedOverAmount =
    crossedOverAmount !== undefined && crossedOverAmount.amount > contract.premium.amount

  let productPrice
  if (showCrossedOverAmount) {
    productPrice = { ...crossedOverAmount, reducedAmount: contract.premium.amount }
  } else {
    productPrice = { ...contract.premium }
  }

  const productDocuments = contract.productVariant.documents.map((item) => ({
    title: item.displayName,
    url: item.url,
  }))

  const endDate = convertToDate(contract.activeTo)
  if (endDate === null) throw new Error(`Invalid end date for contract ${contract.id}`)

  const startDateProps = {
    label: t('TRIAL_TERMINATION_DATE_MESSAGE', {
      date: formatter.dateFull(endDate, { abbreviateMonth: true }),
    }),
  }

  return (
    <ProductItem
      title={contract.productVariant.displayName}
      price={productPrice}
      startDate={startDateProps}
      productDetails={productDetails}
      productDocuments={productDocuments}
      exposure={contract.exposureDisplayName}
    />
  )
}
