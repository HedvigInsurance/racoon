import styled from '@emotion/styled'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { useTranslation } from 'next-i18next'
import { Space } from 'ui'
import { FormElement } from '@/components/ProductPage/ProductPage.constants'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { useCurrencyFormatter } from '@/utils/useCurrencyFormatter'

type Props = {
  offers: Array<ProductOfferFragment>
  selectedOfferId: string
  onValueChange: (offerId: string) => void
}

export const TierSelector = ({ offers, selectedOfferId, onValueChange }: Props) => {
  const { t } = useTranslation()
  const currencyFormatter = useCurrencyFormatter(offers[0].price.currencyCode)

  if (offers.length === 1) {
    return <input hidden readOnly name={FormElement.ProductOfferId} value={selectedOfferId} />
  }

  return (
    <Space y={2}>
      <p>Select tier</p>
      <StyledRadioGroup
        name={FormElement.ProductOfferId}
        value={selectedOfferId}
        onValueChange={onValueChange}
      >
        {offers.map((offer) => (
          <OfferItem key={offer.id} value={offer.id}>
            <IndicatorBox>
              <IndicatorWrapper>
                <Indicator />
              </IndicatorWrapper>
            </IndicatorBox>
            <TitleBox>{offer.variant.displayName}</TitleBox>
            <PriceBox>
              {t('MONTHLY_PRICE', { displayAmount: currencyFormatter.format(offer.price.amount) })}
            </PriceBox>
            <FooterBox>Space for some description.</FooterBox>
          </OfferItem>
        ))}
      </StyledRadioGroup>
    </Space>
  )
}

const StyledRadioGroup = styled(RadioGroup.Root)(({ theme }) => ({
  display: 'flex',
  gap: theme.space[2],
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  scrollSnapType: 'x mandatory',
  overflowX: 'auto',
}))

const OfferItem = styled(RadioGroup.Item)(({ theme }) => ({
  scrollSnapAlign: 'center',
  flex: '0 0 85%',

  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: theme.space[2],

  padding: '1rem',
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: theme.colors.gray500,
  borderRadius: 8,

  '&[data-state=checked]': {
    borderColor: theme.colors.gray900,
  },
}))

const IndicatorBox = styled.div({
  gridArea: '1 / 1 / 3 / 2',
})

const IndicatorWrapper = styled.div(({ theme }) => ({
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: theme.colors.gray900,
  borderRadius: '0.75rem',
  width: '1.25rem',
  height: '1.25rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))
const Indicator = styled(RadioGroup.Indicator)(({ theme }) => ({
  display: 'block',
  width: '0.625rem',
  height: '0.625rem',
  borderRadius: '0.3125rem',
  backgroundColor: theme.colors.gray900,
}))

const TitleBox = styled.div({
  gridArea: '1 / 2 / 2 / 3',
})

const PriceBox = styled.div({
  gridArea: '1 / 3 / 2 / 4',
})

const FooterBox = styled.div({
  gridArea: '2 / 2 / 3 / 4',
})
