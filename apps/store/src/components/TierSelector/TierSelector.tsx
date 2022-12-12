import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { useTranslation } from 'next-i18next'
import { Dispatch, SetStateAction } from 'react'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'
import { FormElement } from '../ProductPage/PurchaseForm/PurchaseForm.constants'
import {
  RecommendedItem,
  SecondaryTextStyle,
  TierItemContainer,
  TitleContainer,
  TitleItem,
  Root,
  Item,
  HeaderWithTrigger,
  Content,
} from './TierSelectorStyles'

type TierItemProps = {
  title: string
  price: string
  description: string
  isSelected?: boolean
  recommendedText?: string
  children?: React.ReactNode
  handleClick?: () => void
} & AccordionPrimitives.AccordionItemProps

const TierItem = ({
  title,
  price,
  description,
  isSelected = false,
  recommendedText = '',
  handleClick,
}: TierItemProps) => (
  <TierItemContainer isSelected={isSelected} onClick={handleClick}>
    <TitleContainer>
      <TitleItem>{title}</TitleItem>
      <TitleItem>
        <SecondaryTextStyle>{price}</SecondaryTextStyle>
      </TitleItem>
    </TitleContainer>
    <SecondaryTextStyle>{description}</SecondaryTextStyle>
    {recommendedText ? <RecommendedItem>{recommendedText}</RecommendedItem> : null}
  </TierItemContainer>
)

export type TierSelectorProps = {
  offers: Array<ProductOfferFragment>
  selectedOfferId: string
  onValueChange: Dispatch<SetStateAction<string>>
}
export const TierSelector = ({ offers, selectedOfferId, onValueChange }: TierSelectorProps) => {
  const { t } = useTranslation()

  const currencyFormatter = useCurrencyFormatter(offers[0].price.currencyCode)
  const selectedOffer = offers.find((offer) => offer.id === selectedOfferId)

  const handleClick = (id: string) => {
    onValueChange?.(id)
  }

  if (offers.length === 1) {
    return <input hidden readOnly name={FormElement.ProductOfferId} value={selectedOfferId} />
  }

  return (
    <Root type="multiple">
      <input
        type="text"
        hidden
        readOnly
        value={selectedOfferId}
        name={FormElement.ProductOfferId}
      />
      <Item value={selectedOfferId}>
        <HeaderWithTrigger>
          {selectedOffer ? (
            <>
              <div>{selectedOffer.variant.typeOfContract}</div>
              <SecondaryTextStyle>
                {t('MONTHLY_PRICE', {
                  displayAmount: currencyFormatter.format(selectedOffer.price.amount),
                })}
              </SecondaryTextStyle>
            </>
          ) : (
            <div>{t('TIER_SELECTOR_DEFAULT_LABEL')}</div>
          )}
        </HeaderWithTrigger>
        <Content>
          {offers.map((offer) => {
            const {
              id,
              price: { amount },
            } = offer

            return (
              <TierItem
                key={id}
                value={id}
                title={offer.variant.typeOfContract}
                description="some description here"
                price={t('MONTHLY_PRICE', {
                  displayAmount: amount,
                })}
                isSelected={selectedOfferId === id}
                handleClick={() => handleClick(id)}
              />
            )
          })}
        </Content>
      </Item>
    </Root>
  )
}
