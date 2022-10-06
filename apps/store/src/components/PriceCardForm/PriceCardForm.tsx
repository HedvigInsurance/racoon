import styled from '@emotion/styled'
import { Button, mq, Space } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { FormElement } from '@/components/ProductPage/ProductPage.constants'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { TickIcon } from '@/components/TickIcon/TickIcon'

const USP_LIST = ['No binding time', 'Pay monthly', 'Pick start date']

type Gradient = readonly [string, string]

export type PriceCardFormProps = {
  title: string
  cost?: number
  currencyCode: string
  gradient: Gradient
  loading?: boolean
  pricedVariantId?: string
} & React.ComponentPropsWithoutRef<'form'>

export const PriceCardForm = ({
  title,
  gradient: [fromColor, toColor],
  cost,
  currencyCode,
  loading = false,
  pricedVariantId,
  ...formProps
}: PriceCardFormProps) => {
  return (
    <form {...formProps}>
      <input type="hidden" name={FormElement.ProductOfferId} value={pricedVariantId} />
      <Wrapper y={1}>
        <CenteredPillow fromColor={fromColor} toColor={toColor} />

        <CenteredText>
          <Text size="m">{title}</Text>
        </CenteredText>

        <PricePreviewContainer>
          <PreviewText aria-disabled={cost === undefined}>
            {currencyCode} {cost ?? '—'} /mth.
          </PreviewText>
        </PricePreviewContainer>

        <SpaceFlex space={0.5} direction="vertical" align="center">
          <CustomButton fullWidth disabled={cost === undefined || loading}>
            Add to cart
          </CustomButton>
          <HorizontalList>
            {USP_LIST.map((usp) => (
              <HorizontalListItem key={usp} space={0.25} align="center">
                <TickIcon />
                <OneLineText>{usp}</OneLineText>
              </HorizontalListItem>
            ))}
          </HorizontalList>
        </SpaceFlex>
      </Wrapper>
    </form>
  )
}

const PricePreviewContainer = styled.div(({ theme }) => ({
  display: 'grid',
  justifyContent: 'center',
  minHeight: theme.space[6],
}))

const Wrapper = styled(Space)(({ theme }) => ({
  backgroundColor: theme.colors.gray300,
  borderRadius: 8,
  padding: '1rem',
}))

const CenteredPillow = styled(Pillow)({
  margin: '0 auto',
})

const CustomButton = styled(Button)(({ theme }) => ({
  ':disabled': {
    backgroundColor: theme.colors.gray500,
    color: theme.colors.gray100,
  },
}))

const OneLineText = styled.p(() => ({
  whiteSpace: 'nowrap',
  fontSize: '0.875rem',
}))

const CenteredText = styled.p(() => ({
  textAlign: 'center',
}))

const HorizontalList = styled.div(() => ({
  display: 'flex',
  justifyContent: 'space-around',
  gap: '0.5rem',
  flexFlow: 'row wrap',

  [mq.xs]: {
    justifyContent: 'center',
  },
}))

const HorizontalListItem = styled(SpaceFlex)(() => ({
  flex: 1,
  minWidth: 0,
}))

const PreviewText = styled(CenteredText)(({ theme }) => ({
  fontSize: '1.5rem',

  '&[aria-disabled=true]': {
    color: theme.colors.gray500,
  },
}))
