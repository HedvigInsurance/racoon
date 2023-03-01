import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { useTranslation } from 'next-i18next'
import { Text } from 'ui'
import { FormElement } from '@/components/ProductPage/PurchaseForm/PurchaseForm.constants'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'
import {
  SuggestedItem,
  TierItemContainer,
  TitleContainer,
  TitleItem,
  Root,
  Item,
  HeaderWithTrigger,
  Content,
  TierItemWrapper,
  Separator,
  ToggleText,
} from './TierSelectorStyles'

type TierItemProps = {
  title: string
  price: string
  description?: string
  isSelected?: boolean
  suggestedText?: string
  children?: React.ReactNode
  handleClick?: () => void
} & AccordionPrimitives.AccordionItemProps

const TierItem = ({
  title,
  price,
  description,
  isSelected = false,
  suggestedText,
  handleClick,
}: TierItemProps) => (
  <TierItemWrapper isSelected={isSelected} onClick={handleClick}>
    <TierItemContainer isSelected={isSelected}>
      <TitleContainer>
        <TitleItem>{title}</TitleItem>
        <TitleItem>
          <Text color={isSelected ? 'textPrimary' : 'textSecondary'}>{price}</Text>
        </TitleItem>
      </TitleContainer>
      {description && (
        <Text color={isSelected ? 'textGreen' : 'textSecondary'} size="xs">
          {description}
        </Text>
      )}
      {suggestedText ? <SuggestedItem>{suggestedText}</SuggestedItem> : null}
    </TierItemContainer>
  </TierItemWrapper>
)

const tierSelectorValue = 'tier-selector-item' // needed for radix to handle open/close

export type TierSelectorProps = {
  offers: Array<ProductOfferFragment>
  selectedOffer: ProductOfferFragment
  currencyCode: string
  onValueChange: (offerId: string) => void
}
export const TierSelector = ({ offers, selectedOffer, onValueChange }: TierSelectorProps) => {
  const { t } = useTranslation('purchase-form')
  const getVariantDescription = useGetVariantDescription()
  const formatter = useFormatter()

  const handleClick = (id: string) => {
    onValueChange(id)
  }

  if (offers.length === 1) {
    return <input hidden readOnly name={FormElement.ProductOfferId} value={selectedOffer.id} />
  }

  return (
    <>
      <input
        type="text"
        hidden
        readOnly
        value={selectedOffer.id}
        name={FormElement.ProductOfferId}
      />
      <Root type="multiple" defaultValue={[tierSelectorValue]}>
        <Item value={tierSelectorValue}>
          <HeaderWithTrigger>
            <Text>{t('TIER_SELECTOR_SELECTED_LABEL', { ns: 'purchase-form' })}</Text>
            <ToggleText>{selectedOffer.variant.displayName}</ToggleText>
          </HeaderWithTrigger>
          <Content>
            <Separator />
            {offers.map((offer) => (
              <TierItem
                key={offer.id}
                value={offer.id}
                title={offer.variant.displayName}
                description={getVariantDescription(offer.variant.typeOfContract)}
                price={formatter.monthlyPrice(offer.price)}
                isSelected={selectedOffer?.id === offer.id}
                handleClick={() => handleClick(offer.id)}
              />
            ))}
          </Content>
        </Item>
      </Root>
    </>
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
