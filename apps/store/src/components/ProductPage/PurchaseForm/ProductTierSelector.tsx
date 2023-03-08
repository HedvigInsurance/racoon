import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Text } from 'ui'
import { FormElement } from '@/components/ProductPage/PurchaseForm/PurchaseForm.constants'
import * as TierLevelRadioGroup from '@/components/TierSelector/TierLevelRadioGroup'
import * as TierSelector from '@/components/TierSelector/TierSelector'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'

type Props = {
  offers: Array<ProductOfferFragment>
  selectedOffer: ProductOfferFragment
  onValueChange: (offerId: string) => void
}

export const ProductTierSelector = ({ offers, selectedOffer, onValueChange }: Props) => {
  const { t } = useTranslation('purchase-form')
  const getVariantDescription = useGetVariantDescription()
  const formatter = useFormatter()

  if (offers.length === 1) {
    return <input hidden readOnly name={FormElement.ProductOfferId} value={selectedOffer.id} />
  }

  return (
    <TierSelector.Root>
      <TierSelector.Header>
        <Text>{t('TIER_SELECTOR_SELECTED_LABEL', { ns: 'purchase-form' })}</Text>
        <ToggleText>{selectedOffer.variant.displayName}</ToggleText>
      </TierSelector.Header>

      <TierSelector.Content>
        <TierLevelRadioGroup.Root
          name={FormElement.ProductOfferId}
          value={selectedOffer.id}
          onValueChange={onValueChange}
        >
          {offers.map((offer) => (
            <TierLevelRadioGroup.Item
              key={offer.id}
              value={offer.id}
              title={offer.variant.displayName}
              price={formatter.monthlyPrice(offer.price)}
              description={getVariantDescription(offer.variant.typeOfContract)}
            />
          ))}
        </TierLevelRadioGroup.Root>
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
    }
  }
}

const ToggleText = styled(Text)({
  '[data-state=open] &': { display: 'none' },
})
