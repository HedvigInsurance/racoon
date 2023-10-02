import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { LockIcon, theme } from 'ui'
import { ProductItem } from '@/components/ProductItem/ProductItem'
import { type ContractQuery, CurrencyCode } from '@/services/apollo/generated'
import { convertToDate } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'

type Contract = Pick<NonNullable<ContractQuery['contract']>, 'id' | 'variant'>

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

  const productDocuments = FIXTURE_CONTRACT.variant.documents.map((item) => ({
    title: item.displayName,
    url: item.url,
  }))

  const endDate = convertToDate(FIXTURE_CONTRACT.endDate)
  if (endDate === null) throw new Error(`Invalid end date for contract ${props.contract.id}`)

  const startDateProps = {
    label: t('TRIAL_TERMINATION_DATE_MESSAGE', { date: formatter.fromNow(endDate) }),
    tooltip: t('TRIAL_TERMINATION_DATE_TOOLTIP'),
  }

  return (
    <ProductItem
      title={t('TRIAL_TITLE')}
      pillowSrc={FIXTURE_CONTRACT.product.pillowImage.src}
      price={FIXTURE_CONTRACT.cost}
      startDate={startDateProps}
      productDetails={productDetails}
      productDocuments={productDocuments}
      subtitle={FIXTURE_CONTRACT.exposure.displayNameFull}
      Icon={<LockIcon color={theme.colors.textTranslucentSecondary} />}
    />
  )
}

// TODO: remove this when we can get the data from the API
const FIXTURE_CONTRACT = {
  cost: { amount: 299, currencyCode: CurrencyCode.Sek },

  endDate: '2024-12-01',

  exposure: {
    displayNameFull: 'ABC 123 · Volkswagen Polo',
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
    pillowImage: {
      src: 'https://a.storyblok.com/f/165473/832x832/1fe7a75de6/hedvig-pillows-car.png',
    },
  },

  variant: {
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
