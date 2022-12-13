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
  TierItemWrapper,
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
  <TierItemWrapper isSelected={isSelected} onClick={handleClick}>
    <TierItemContainer isSelected={isSelected}>
      <TitleContainer>
        <TitleItem>{title}</TitleItem>
        <TitleItem>
          <SecondaryTextStyle>{price}</SecondaryTextStyle>
        </TitleItem>
      </TitleContainer>
      <SecondaryTextStyle>{description}</SecondaryTextStyle>
      {recommendedText ? <RecommendedItem>{recommendedText}</RecommendedItem> : null}
    </TierItemContainer>
  </TierItemWrapper>
)

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
  const { t } = useTranslation()
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
        <Item value={'item-1'}>
          <HeaderWithTrigger>
            {selectedOffer ? (
              <>
                <div>Skyddsnivå</div>
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
                description="some description here"
                price={t('MONTHLY_PRICE', {
                  displayAmount: currencyFormatter.format(offer.price.amount),
                })}
                isSelected={selectedOfferId === offer.id}
                handleClick={() => handleClick(offer.id)}
                recommendedText={'Hey there'}
              />
            ))}
          </Content>
        </Item>
      </Root>
    </>
  )
}
