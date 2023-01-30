import styled from '@emotion/styled'
import { theme, Text } from 'ui'

export type CoverageListProps = {
  items: Array<string>
}

export const CoverageList = ({ items }: CoverageListProps) => {
  if (items.length === 0) return null

  return (
    <List>
      {items.map((item, index) => (
        <Item key={item}>
          <NumberText size="xs" color="textSecondary">
            {String(index + 1).padStart(2, '0')}
          </NumberText>
          <Text size="xs" color="textPrimary">
            {item}
          </Text>
        </Item>
      ))}
    </List>
  )
}

const List = styled.ul({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.sm,
})

const Item = styled.li({
  display: 'flex',
  gap: theme.space.xs,
})

const NumberText = styled(Text)({
  flexShrink: 0,
  fontVariantNumeric: 'tabular-nums',
})
