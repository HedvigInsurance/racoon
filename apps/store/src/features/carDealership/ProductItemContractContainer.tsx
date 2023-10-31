import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { ProductItem } from '@/components/ProductItem/ProductItem'
import { type ContractQuery, CurrencyCode } from '@/services/apollo/generated'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'

type Contract = Pick<NonNullable<ContractQuery['contract']>, 'id'>

type Props = {
  contract: Contract
}

export const ProductItemContractContainerCar = (props: Props) => {
  const formatter = useFormatter()
  const { t } = useTranslation('carDealership')

  const productDetails = useMemo(
    () =>
      FIXTURE_CONTRACT.displayItems.map((item) => ({
        title: item.displayTitle,
        value: item.displayValue,
      })),
    [],
  )

  const productDocuments = FIXTURE_CONTRACT.currentAgreement.productVariant.documents.map(
    (item) => ({
      title: item.displayName,
      url: item.url,
    }),
  )

  const endDate = convertToDate(FIXTURE_CONTRACT.endDate)
  if (endDate === null) throw new Error(`Invalid end date for contract ${props.contract.id}`)

  const startDateProps = {
    label: t('TRIAL_TERMINATION_DATE_MESSAGE', {
      date: formatter.dateFull(endDate, { abbreviateMonth: true }),
    }),
    tooltip: t('TRIAL_TERMINATION_DATE_TOOLTIP'),
  }

  return (
    <ProductItem
      title={FIXTURE_CONTRACT.product.displayNameFull}
      price={FIXTURE_CONTRACT.cost}
      startDate={startDateProps}
      productDetails={productDetails}
      productDocuments={productDocuments}
      badge={{ children: t('CONTRACT_CARD_BADGE'), color: 'signalAmberHighlight' }}
      exposure={FIXTURE_CONTRACT.exposure.displayNameShort}
    />
  )
}

// TODO: remove this when we can get the data from the API
const FIXTURE_CONTRACT = {
  cost: { amount: 579, currencyCode: CurrencyCode.Sek, reducedAmount: 299 },

  endDate: '2023-11-11',

  exposure: {
    displayNameShort: 'LPP 083 ∙ Helförsäkring',
  },

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

  product: {
    displayNameFull: 'Bilförsäkring',
    pillowImage: {
      src: 'https://a.storyblok.com/f/165473/832x832/1fe7a75de6/hedvig-pillows-car.png',
    },
  },

  currentAgreement: {
    productVariant: {
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
  },
}
