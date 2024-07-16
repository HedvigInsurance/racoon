import { useTranslation } from 'next-i18next'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { Heading, Text } from 'ui'
import type { ProductOfferFragment } from '@/services/graphql/generated'
import { useFormatter } from '@/utils/useFormatter'
import * as CardRadioGroup from './CardRadioGroup'

type Props = {
  offers: Array<ProductOfferFragment>
  selectedOffer: ProductOfferFragment
  onValueChange: (offerId: string) => void
}

// TODO:
// - show compare btn
// - default tier label (always middle?)
export function ProductTierSelectorV2({ offers, selectedOffer, onValueChange }: Props) {
  const getVariantDescription = useGetVariantDescription()
  const formatter = useFormatter()

  return (
    <CardRadioGroup.Root value={selectedOffer.id} onValueChange={onValueChange}>
      {offers.map((offer) => (
        <CardRadioGroup.Item key={offer.id} value={offer.id}>
          <Heading as="h2" variant="standard.24">
            {offer.variant.displayNameSubtype || offer.variant.displayName}
          </Heading>
          <Heading as="h3" variant="standard.24" color="textSecondary">
            {formatter.monthlyPrice(offer.cost.net)}
          </Heading>
          <Text color="textSecondary" className={sprinkles({ marginTop: 'md' })}>
            {getVariantDescription(offer.variant.typeOfContract)}
          </Text>
        </CardRadioGroup.Item>
      ))}
    </CardRadioGroup.Root>
  )
}

// TODO: fetch product variant descriptions from the API
const useGetVariantDescription = () => {
  const { t } = useTranslation('purchase-form')

  return (typeOfContract: string) => {
    switch (typeOfContract) {
      case 'SE_CAR_TRAFFIC':
        return t('SE_CAR_TRAFFIC_DESCRIPTION')
      case 'SE_CAR_HALF':
        return t('SE_CAR_HALF_DESCRIPTION')
      case 'SE_CAR_FULL':
        return t('SE_CAR_FULL_DESCRIPTION')
      case 'SE_DOG_BASIC':
        return t('SE_DOG_BASIC_DESCRIPTION')
      case 'SE_DOG_STANDARD':
        return t('SE_DOG_STANDARD_DESCRIPTION')
      case 'SE_DOG_PREMIUM':
        return t('SE_DOG_PREMIUM_DESCRIPTION')
      case 'SE_CAT_BASIC':
        return t('SE_CAT_BASIC_DESCRIPTION')
      case 'SE_CAT_STANDARD':
        return t('SE_CAT_STANDARD_DESCRIPTION')
      case 'SE_CAT_PREMIUM':
        return t('SE_CAT_PREMIUM_DESCRIPTION')
    }
  }
}
