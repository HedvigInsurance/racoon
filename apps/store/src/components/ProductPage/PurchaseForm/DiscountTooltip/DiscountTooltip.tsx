import styled from '@emotion/styled'
import { Text, theme } from 'ui'

type Props = {
  children: string
  subtitle?: string
}

export const DiscountTooltip = ({ children, subtitle }: Props) => {
  return (
    <Root>
      <Bubble>
        <Text size="xs" color="textGreen" align="center">
          {children}
        </Text>
        {subtitle && (
          <SecondaryText size="xs" align="center">
            {subtitle}
          </SecondaryText>
        )}
      </Bubble>
      <Tip />
    </Root>
  )
}

const TIP_HEIGHT = '0.625rem'
const HALF_TIP_WIDTH = '0.625rem'

const Root = styled.div({
  paddingBottom: TIP_HEIGHT,
  position: 'relative',
  isolation: 'isolate',
  display: 'inline-block',
})

const Bubble = styled.div({
  backgroundColor: theme.colors.greenFill1,
  border: `1px solid ${theme.colors.green200}`,
  paddingBlock: theme.space.xs,
  paddingInline: theme.space.sm,
  borderRadius: theme.radius.sm,

  boxShadow: '0px 1px 1px rgba(51, 67, 43, 0.15), 0px 2px 3px rgba(51, 67, 43, 0.1)',
})

const Tip = styled.div({
  position: 'absolute',
  bottom: 1,
  left: '50%',
  transform: `translateX(-${HALF_TIP_WIDTH})`,
  filter: `
    drop-shadow(0px 2px 1px rgba(51, 67, 43, 0.15))
    drop-shadow(0px 3px 3px rgba(51, 67, 43, 0.1))
  `,

  width: 0,
  height: 0,
  borderLeft: `${HALF_TIP_WIDTH} solid transparent`,
  borderRight: `${HALF_TIP_WIDTH} solid transparent`,
  borderTop: `${HALF_TIP_WIDTH} solid ${theme.colors.greenFill1}`,
})

const SecondaryText = styled(Text)({ color: theme.colors.green700 })
