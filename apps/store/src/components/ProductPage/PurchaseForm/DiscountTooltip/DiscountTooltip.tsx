import styled from '@emotion/styled'
import { Text, theme } from 'ui'

type Props = {
  children: string
  subtitle?: string
  color?: 'green' | 'gray'
}

export const DiscountTooltip = ({ children, subtitle, color = 'green' }: Props) => {
  const Bubble = color === 'green' ? GreenBubble : GrayBubble

  return (
    <Root>
      <Bubble>
        <Text size="xs" color={color === 'green' ? 'textGreen' : 'textPrimary'} align="center">
          {children}
        </Text>
        {subtitle && (
          <Text
            size="xs"
            color={color === 'green' ? 'textGreen' : 'textSecondaryOnGray'}
            align="center"
          >
            {subtitle}
          </Text>
        )}
      </Bubble>
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

const GrayBubble = styled.div({
  backgroundColor: theme.colors.opaque1,
  paddingBlock: theme.space.xs,
  paddingInline: theme.space.sm,
  borderRadius: theme.radius.sm,
  position: 'relative',

  filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15))',

  '::after': {
    content: '""',
    position: 'absolute',
    bottom: `calc(-1 * ${TIP_HEIGHT})`,
    left: '50%',
    transform: `translateX(-${HALF_TIP_WIDTH})`,

    width: 0,
    height: 0,
    borderLeft: `${HALF_TIP_WIDTH} solid transparent`,
    borderRight: `${HALF_TIP_WIDTH} solid transparent`,
    borderTop: `${HALF_TIP_WIDTH} solid ${theme.colors.opaque1}`,
  },
})

const GreenBubble = styled(GrayBubble)({
  backgroundColor: theme.colors.signalGreenFill,
  border: `1px solid ${theme.colors.grayTranslucent200}`,

  filter: `
    drop-shadow(0px 1px 1px rgba(51, 67, 43, 0.15))
    drop-shadow(0px 2px 3px rgba(51, 67, 43, 0.1))
  `,

  '::after': {
    borderTopColor: theme.colors.signalGreenFill,
  },
})
