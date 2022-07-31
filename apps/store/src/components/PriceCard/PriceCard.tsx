import styled from '@emotion/styled'
import { Button, mq, Space } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { TickIcon } from './TickIcon'

const USP_LIST = ['No binding time', 'Pay monthly', 'Pick start date']

type Gradient = readonly [string, string]

export type PriceCardProps = {
  name: string
  cost?: number
  currencyCode: string
  onClick: () => void
  gradient: Gradient
}

export const PriceCard = ({
  name,
  gradient: [fromColor, toColor],
  cost,
  currencyCode,
  onClick,
}: PriceCardProps) => {
  return (
    <Wrapper y={1}>
      <CenteredPillow fromColor={fromColor} toColor={toColor} />

      <CenteredText>
        <Text size="m">{name}</Text>
      </CenteredText>

      <PreviewText aria-disabled={cost === undefined}>
        {currencyCode} {cost ?? '—'} /mth.
      </PreviewText>

      <SpaceFlex space={0.5} direction="vertical" align="center">
        <CustomButton fullWidth disabled={cost === undefined} onClick={onClick}>
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
  )
}

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
