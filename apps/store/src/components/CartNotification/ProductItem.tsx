import styled from '@emotion/styled'
import { Text } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

export type ProductItemProps = {
  name: string
  price: string
}

export const ProductItem = ({ name, price }: ProductItemProps) => {
  return (
    <SpaceFlex space={1} align="center">
      <Pillow size="small" />
      <SpaceBetween>
        <Text>{name}</Text>
        <Text>{price}</Text>
      </SpaceBetween>
    </SpaceFlex>
  )
}

const SpaceBetween = styled.div(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space.xs,
}))
