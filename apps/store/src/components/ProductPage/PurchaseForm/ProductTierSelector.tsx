import { useTranslation } from 'next-i18next'
import type { ComponentPropsWithoutRef } from 'react'
import { Text } from 'ui'
import * as TierSelector from '@/components/TierSelector/TierSelector'
import type { ProductOfferFragment } from '@/services/graphql/generated'
import { useFormatter } from '@/utils/useFormatter'

type Props = ComponentPropsWithoutRef<typeof TierSelector.Root> & {
  offers: Array<ProductOfferFragment>
  selectedOffer: ProductOfferFragment
  onValueChange: (offerId: string) => void
}

export const ProductTierSelector = ({
  offers,
  selectedOffer,
  onValueChange,
  children,
  ...props
}: Props) => {
  const { t } = useTranslation('purchase-form')
  const getVariantDescription = useGetVariantDescription()
  const formatter = useFormatter()

  return (
    <TierSelector.Root {...props}>
      <TierSelector.Header>
        <div>
          <Text size="xs" color="textTranslucentSecondary">
            {t('TIER_SELECTOR_SELECTED_LABEL', { ns: 'purchase-form' })}
          </Text>
          <Text size="xl">
            {selectedOffer.variant.displayNameSubtype || selectedOffer.variant.displayName}
          </Text>
        </div>
      </TierSelector.Header>

      <TierSelector.Content>
        <TierSelector.OptionsList value={selectedOffer.id} onValueChange={onValueChange}>
          {offers.map((offer) => (
            <TierSelector.OptionsListItem
              key={offer.id}
              value={offer.id}
              title={offer.variant.displayNameSubtype || offer.variant.displayName}
              price={formatter.monthlyPrice(offer.cost.net)}
              description={getVariantDescription(offer.variant.typeOfContract)}
            />
          ))}
        </TierSelector.OptionsList>
        {children}
      </TierSelector.Content>
    </TierSelector.Root>
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
