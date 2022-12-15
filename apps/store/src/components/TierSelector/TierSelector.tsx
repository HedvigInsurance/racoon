import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { useTranslation } from 'next-i18next'
import { Dispatch, SetStateAction } from 'react'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'
import { FormElement } from '../ProductPage/PurchaseForm/PurchaseForm.constants'
import {
  SuggestedItem,
  SecondaryText,
  TierItemContainer,
  TitleContainer,
  TitleItem,
  Root,
  Item,
  HeaderWithTrigger,
  Content,
  TierItemWrapper,
  PriceText,
} from './TierSelectorStyles'

type TierItemProps = {
  title: string
  price: string
  description: string
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
  suggestedText = '',
  handleClick,
}: TierItemProps) => (
  <TierItemWrapper isSelected={isSelected} onClick={handleClick}>
    <TierItemContainer isSelected={isSelected}>
      <TitleContainer>
        <TitleItem>{title}</TitleItem>
        <TitleItem>
          <PriceText isSelected={isSelected}>{price}</PriceText>
        </TitleItem>
      </TitleContainer>
      <SecondaryText>{description}</SecondaryText>
      {suggestedText ? <SuggestedItem>{suggestedText}</SuggestedItem> : null}
    </TierItemContainer>
  </TierItemWrapper>
)

const tierSelectorValue = 'tier-selector-item' // needed for radix to handle open/close

export type TierSelectorProps = {
  offers: Array<ProductOfferFragment>
  selectedOfferId: string
  currencyCode: string
  onValueChange: Dispatch<SetStateAction<string>>
}
export const TierSelector = ({ offers, selectedOfferId, onValueChange }: TierSelectorProps) => {
  const { t } = useTranslation('purchase-form')
  const formatter = useFormatter()

  const selectedOffer = offers.find((offer) => offer.id === selectedOfferId)

  const handleClick = (id: string) => {
    onValueChange?.(id)
  }

  if (offers.length === 1) {
    return <input hidden readOnly name={FormElement.ProductOfferId} value={selectedOfferId} />
  }

  return (
    <>
      <input
        type="text"
        hidden
        readOnly
        value={selectedOfferId}
        name={FormElement.ProductOfferId}
      />
      <Root type="multiple">
        <Item value={tierSelectorValue}>
          <HeaderWithTrigger>
            {selectedOffer ? (
              <>
                <div>{t('TIER_SELECTOR_SELECTED_LABEL', { ns: 'purchase-form' })}</div>
                <div>{selectedOffer.variant.typeOfContract}</div>
              </>
            ) : (
              <div>{t('TIER_SELECTOR_DEFAULT_LABEL', { ns: 'purchase-form' })}</div>
            )}
          </HeaderWithTrigger>
          <Content>
            {offers.map((offer) => (
              <TierItem
                key={offer.id}
                value={offer.id}
                title={offer.variant.typeOfContract}
                description="Description here"
                price={formatter.monthlyPrice(offer.price)}
                isSelected={selectedOffer?.id === offer.id}
                handleClick={() => handleClick(offer.id)}
                suggestedText={'Suggested'}
              />
            ))}
          </Content>
        </Item>
      </Root>
    </>
  )
}
