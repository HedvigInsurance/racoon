import styled from '@emotion/styled'
import { Text, theme } from 'ui'

type Props = {
  code: string
  explanation: string
}

export const Discount = (props: Props) => {
  return (
    <Wrapper>
      <Chip>
        <Text as="span" size="xs">
          {props.code}
        </Text>
      </Chip>
      <Text>{props.explanation}</Text>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space.md,
  paddingInline: theme.space.xxxs,
})

const Chip = styled.div({
  borderRadius: theme.radius.xxs,
  backgroundColor: theme.colors.gray200,
  textTransform: 'uppercase',
  paddingBlock: theme.space.xxs,
  paddingInline: theme.space.xs,
})
