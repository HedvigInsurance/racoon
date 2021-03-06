import styled from '@emotion/styled'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

export type ProductItemProps = {
  name: string
  price: string
  gradient: readonly [string, string]
}

export const ProductItem = ({ name, price, gradient: [fromColor, toColor] }: ProductItemProps) => {
  return (
    <SpaceFlex space={1} align="center">
      <Pillow size="small" fromColor={fromColor} toColor={toColor} />
      <SpaceBetween>
        <BodyText>{name}</BodyText>
        <BodyText>{price}</BodyText>
      </SpaceBetween>
    </SpaceFlex>
  )
}

const SpaceBetween = styled.div(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space[2],
}))

const BodyText = styled.p(({ theme }) => ({
  color: theme.colors.gray900,
  fontSize: theme.fontSizes.body,
}))
