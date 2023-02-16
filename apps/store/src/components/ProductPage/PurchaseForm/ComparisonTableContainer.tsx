import { useTranslation } from 'next-i18next'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import * as ComparisonTable from './ComparisonTable/ComparisonTable'

type Props = {
  offers: PriceIntent['offers']
  selectedOfferId: string
}

export const ComparisonTableContainer = ({ offers, selectedOfferId }: Props) => {
  const getVeryShortVariantDisplayName = useGetVeryShortVariantDisplayName()

  const getUniquePerilTitles = () => {
    const allPerils = offers.flatMap((offer) => offer.variant.perils)
    const perilTitles = allPerils.map((peril) => peril.title)
    return removeDuplicates(perilTitles)
  }

  return (
    <ComparisonTable.Root>
      <ComparisonTable.Head>
        <ComparisonTable.Header />
        {offers.map((offer) => (
          <ComparisonTable.Header key={offer.id} active={isSelectedOffer(offer, selectedOfferId)}>
            {getVeryShortVariantDisplayName(offer.variant.typeOfContract)}
          </ComparisonTable.Header>
        ))}
      </ComparisonTable.Head>
      <ComparisonTable.Body>
        {getUniquePerilTitles().map((perilTitle) => (
          <ComparisonTable.Row key={perilTitle}>
            <ComparisonTable.TitleDataCell>{perilTitle}</ComparisonTable.TitleDataCell>
            {offers.map((offer) => (
              <ComparisonTable.DataCell
                key={offer.id}
                active={isSelectedOffer(offer, selectedOfferId)}
              >
                {offerHasPeril(offer, perilTitle) ? (
                  <ComparisonTable.CheckIcon />
                ) : (
                  <ComparisonTable.MissingIcon />
                )}
              </ComparisonTable.DataCell>
            ))}
          </ComparisonTable.Row>
        ))}
      </ComparisonTable.Body>
    </ComparisonTable.Root>
  )
}

const removeDuplicates = <T,>(arr: T[]): T[] => Array.from(new Set(arr))

const offerHasPeril = (offer: ProductOfferFragment, perilTitle: string) =>
  offer.variant.perils.some((peril) => peril.title === perilTitle)

//@TODO - base on selected offer
const isSelectedOffer = (offer: ProductOfferFragment, selectedOfferId: string) => {
  if (offer.id === selectedOfferId) return true
  return false
}

// TODO: fetch from API
const useGetVeryShortVariantDisplayName = () => {
  const { t } = useTranslation('purchase-form')

  return (typeOfContract: string) => {
    switch (typeOfContract) {
      case 'SE_CAR_FULL':
        return t('COMPARISON_TABLE_COLUMN_SE_CAR_FULL')
      case 'SE_CAR_HALF':
        return t('COMPARISON_TABLE_COLUMN_SE_CAR_HALF')
      case 'SE_CAR_TRAFFIC':
        return t('COMPARISON_TABLE_COLUMN_SE_CAR_TRAFFIC')
    }
  }
}
