import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { Button, Space } from 'ui'
import { FormElement } from '@/components/ProductPage/ProductPage.constants'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { ProductOfferFragment } from '@/services/apollo/generated'
import { ProductOfferPicker } from './ProductOfferPicker'

export type PriceCardFormProps = {
  loading: boolean
  offers: Array<ProductOfferFragment>
  selectedOffer: ProductOfferFragment
  onChangeOffer: (offer: ProductOfferFragment) => void
} & React.ComponentPropsWithoutRef<'form'>

export const PriceCardForm = ({
  loading,
  offers,
  selectedOffer,
  onChangeOffer,
  ...formProps
}: PriceCardFormProps) => {
  const handleValueChange = (offerId: string) => {
    const productOffer = offers.find((item) => item.id === offerId)
    if (productOffer === undefined) {
      datadogLogs.logger.error('Unable to select product offer', { offerId, offers })
    } else {
      onChangeOffer(productOffer)
    }
  }

  return (
    <form {...formProps}>
      <Wrapper y={1.5}>
        <Space y={1}>
          {offers.length > 1 ? (
            <Space y={0.75}>
              <Padded as="p">Select tier</Padded>
              <ProductOfferPicker
                name={FormElement.ProductOfferId}
                value={selectedOffer.id}
                onValueChange={handleValueChange}
                offers={offers}
              />
            </Space>
          ) : (
            <input hidden readOnly name={FormElement.ProductOfferId} value={selectedOffer.id} />
          )}

          <Padded>
            <SpaceFlex space={0.5} direction="vertical" align="center">
              <CustomButton fullWidth disabled={loading}>
                Add to cart
              </CustomButton>
              <CenteredText>
                <Text size="s">Cancel anytime</Text>
              </CenteredText>
            </SpaceFlex>
          </Padded>
        </Space>
      </Wrapper>
    </form>
  )
}

const Wrapper = styled(Space)(() => ({}))

const CustomButton = styled(Button)(({ theme }) => ({
  ':disabled': {
    backgroundColor: theme.colors.gray500,
    color: theme.colors.gray100,
  },
}))

const CenteredText = styled.p(() => ({
  textAlign: 'center',
}))

const Padded = styled.div(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
}))
