import styled from '@emotion/styled'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { Space, Text, theme } from 'ui'

export const Root = styled(RadioGroup.Root)({
  padding: theme.space.xs,
})

type ItemProps = {
  title: string
  price: string
  description?: string
  value: string
}

export const Item = ({ title, price, description, value }: ItemProps) => {
  return (
    <RadioGroupItem value={value}>
      <Space y={0.5}>
        <Header>
          <Text>{title}</Text>
          <PriceText>{price}</PriceText>
        </Header>
        {description && (
          <Text color="textSecondary" size="xs">
            {description}
          </Text>
        )}
      </Space>
    </RadioGroupItem>
  )
}

const RadioGroupItem = styled(RadioGroup.Item)({
  width: '100%',
  padding: theme.space.xs,
  borderRadius: theme.radius.xxs,
  cursor: 'pointer',

  '&[data-state=checked]': {
    backgroundColor: theme.colors.backgroundStandard,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  },
})

const PriceText = styled(Text)({
  color: theme.colors.textSecondary,

  '[data-state=checked] &': {
    color: theme.colors.textPrimary,
  },
})

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})
