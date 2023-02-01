import styled from '@emotion/styled'
import { Text, theme } from 'ui'

type Props = {
  title: string
  children: string
}

export const PriceMatchBubble = ({ title, children }: Props) => {
  return (
    <Root>
      <Tip />
      <Bubble>
        <Text size="xs" align="center">
          {title}
        </Text>
        <Text size="xs" color="textSecondary" align="center">
          {children}
        </Text>
      </Bubble>
    </Root>
  )
}

const TIP_HEIGHT = '0.625rem'
const HALF_TIP_WIDTH = '0.625rem'
// @TODO: change to theme color
const LIGHT_BLUE = '#E0F0F9'

const Root = styled.div({
  paddingBlockStart: TIP_HEIGHT,
  position: 'relative',
})

const Bubble = styled.div({
  backgroundColor: LIGHT_BLUE,
  paddingBlock: theme.space[3],
  paddingInline: theme.space[4],
  borderRadius: theme.radius.sm,
})

const Tip = styled.div({
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: `translateX(-${HALF_TIP_WIDTH})`,

  width: 0,
  height: 0,
  borderLeft: `${HALF_TIP_WIDTH} solid transparent`,
  borderRight: `${HALF_TIP_WIDTH} solid transparent`,
  borderBottom: `${HALF_TIP_WIDTH} solid ${LIGHT_BLUE}`,
})
