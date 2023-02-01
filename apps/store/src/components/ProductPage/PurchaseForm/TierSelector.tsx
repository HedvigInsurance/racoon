import styled from '@emotion/styled'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { Space, theme } from 'ui'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { useFormatter } from '@/utils/useFormatter'
import { FormElement } from './PurchaseForm.constants'

type Props = {
  offers: Array<ProductOfferFragment>
  selectedOfferId: string
  onValueChange: (offerId: string) => void
}

export const TierSelector = ({ offers, selectedOfferId, onValueChange }: Props) => {
  const formatter = useFormatter()

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
            <TitleBox>{offer.variant.product.displayNameFull}</TitleBox>
            <PriceBox>{formatter.monthlyPrice(offer.price)}</PriceBox>
            <FooterBox>Space for some description.</FooterBox>
          </OfferItem>
        ))}
      </StyledRadioGroup>
    </Space>
  )
}

const StyledRadioGroup = styled(RadioGroup.Root)({
  display: 'flex',
  gap: theme.space.xs,
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
  scrollSnapType: 'x mandatory',
  overflowX: 'auto',
})

const OfferItem = styled(RadioGroup.Item)({
  scrollSnapAlign: 'center',
  flex: '0 0 85%',

  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: theme.space.xs,

  padding: '1rem',
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: theme.colors.gray500,
  borderRadius: 8,

  '&[data-state=checked]': {
    borderColor: theme.colors.gray900,
  },
})

const IndicatorBox = styled.div({
  gridArea: '1 / 1 / 3 / 2',
})

const IndicatorWrapper = styled.div({
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: theme.colors.gray900,
  borderRadius: '0.75rem',
  width: '1.25rem',
  height: '1.25rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
const Indicator = styled(RadioGroup.Indicator)({
  display: 'block',
  width: '0.625rem',
  height: '0.625rem',
  borderRadius: '0.3125rem',
  backgroundColor: theme.colors.gray900,
})

const TitleBox = styled.div({
  gridArea: '1 / 2 / 2 / 3',
})

const PriceBox = styled.div({
  gridArea: '1 / 3 / 2 / 4',
})

const FooterBox = styled.div({
  gridArea: '2 / 2 / 3 / 4',
})
