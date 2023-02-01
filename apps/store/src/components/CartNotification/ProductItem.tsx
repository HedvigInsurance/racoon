import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { Space, Text } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

export type ProductItemProps = {
  name: string
  price: string
  startDate?: string
}

export const ProductItem = ({ name, price, startDate }: ProductItemProps) => {
  const { t } = useTranslation('cart')

  return (
    <SpaceFlex space={1} align="start">
      <Pillow size="small" />
      <TextWrapper>
        <Text>{name}</Text>
        <Space y={1}>
          <Text color="textSecondary">{t('CART_ENTRY_DATE_LABEL', { date: startDate })}</Text>
          <Text>{price}</Text>
        </Space>
      </TextWrapper>
    </SpaceFlex>
  )
}

const TextWrapper = styled.div({
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
})
