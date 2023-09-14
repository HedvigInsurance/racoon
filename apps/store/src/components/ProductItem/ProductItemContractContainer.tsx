import { useMemo } from 'react'
import { type ContractQuery, CurrencyCode } from '@/services/apollo/generated'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'
import { ProductItem } from './ProductItem'

type Contract = NonNullable<ContractQuery['contract']>

type Props = {
  contract: Contract
}

export const ProductItemContractContainerCar = (props: Props) => {
  const formatter = useFormatter()

  const tierLevel = props.contract.variant.displayName

  const productDetails = useMemo(
    () =>
      FIXTURE_CONTRACT.displayItems.map((item) => ({
        title: item.displayTitle,
        value: item.displayValue,
      })),
    [],
  )

  const productDocuments = FIXTURE_CONTRACT.variant.documents.map((item) => ({
    title: item.displayName,
    url: item.url,
  }))

  const endDate = convertToDate(FIXTURE_CONTRACT.endDate)
  if (endDate === null) throw new Error(`Invalid end date for contract ${props.contract.id}`)

  const startDateProps = {
    // TODO: translate
    label: `${tierLevel} until ${formatter.fromNow(endDate)}`,
    tooltip: 'You need to sign a new contract to continue your insurance',
  }

  return (
    <ProductItem
      title={props.contract.variant.displayName}
      pillowSrc={FIXTURE_CONTRACT.variant.product.pillowImage.src}
      price={FIXTURE_CONTRACT.cost}
      startDate={startDateProps}
      productDetails={productDetails}
      productDocuments={productDocuments}
      // TODO: translate
      badge="Active"
    />
  )
}

// TODO: remove this when we can get the data from the API
const FIXTURE_CONTRACT = {
  cost: { amount: 299, currencyCode: CurrencyCode.Sek },

  endDate: '2024-12-24',

  displayItems: [
    {
      displayTitle: 'Registration number',
      displayValue: 'ABC 123',
    },
    {
      displayTitle: 'Address',
      displayValue: 'Hedvigsgatan 11',
    },
    {
      displayTitle: 'Milage',
      displayValue: '1,500 km/year',
    },
  ],

  variant: {
    product: {
      pillowImage: { src: 'https://placekitten.com/200/300' },
    },

    documents: [
      {
        displayName: 'Insurance terms',
        url: 'https://www.hedvig.com/se/forsakringar/hemforsakring/villkor',
      },
      {
        displayName: 'Insurance letter',
        url: 'https://www.hedvig.com/se/forsakringar/hemforsakring/brev',
      },
    ],
  },
}
