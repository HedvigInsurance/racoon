import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { useTranslation } from 'next-i18next'
import { Dispatch, SetStateAction } from 'react'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { I18nNamespace } from '@/utils/l10n/types'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { FormElement } from '../ProductPage/PurchaseForm/PurchaseForm.constants'
import {
  SuggestedItem,
  SecondaryTextStyle,
  TierItemContainer,
  TitleContainer,
  TitleItem,
  Root,
  Item,
  HeaderWithTrigger,
  Content,
  TierItemWrapper,
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
          <SecondaryTextStyle>{price}</SecondaryTextStyle>
        </TitleItem>
      </TitleContainer>
      <SecondaryTextStyle>{description}</SecondaryTextStyle>
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
export const TierSelector = ({
  offers,
  selectedOfferId,
  currencyCode,
  onValueChange,
}: TierSelectorProps) => {
  const { t } = useTranslation(I18nNamespace.PurchaseForm)
  const currencyFormatter = useCurrencyFormatter(currencyCode)

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
                <div>{t('TIER_SELECTOR_SELECTED_LABEL')}</div>
                <div>{selectedOffer.variant.typeOfContract}</div>
              </>
            ) : (
              <div>{t('TIER_SELECTOR_DEFAULT_LABEL')}</div>
            )}
          </HeaderWithTrigger>
          <Content>
            {offers.map((offer) => (
              <TierItem
                key={offer.id}
                value={offer.id}
                title={offer.variant.typeOfContract}
                description="Description here"
                price={t('MONTHLY_PRICE', {
                  displayAmount: currencyFormatter.format(offer.price.amount),
                })}
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
