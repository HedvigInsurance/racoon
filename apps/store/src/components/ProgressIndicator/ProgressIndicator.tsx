import styled from '@emotion/styled'
import { theme } from 'ui/src/theme/theme'

export const Root = styled.ul({
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  gap: theme.space.xs,
})

export const Step = styled.li<{ active?: boolean }>(({ active = false }) => ({
  fontSize: theme.fontSizes.xs,
  height: '2.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.xs,

  color: theme.colors.textTertiary,
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.xxs,
  border: `0.5px solid ${theme.colors.borderTranslucent1}`,

  ...(active && {
    backgroundColor: theme.colors.signalGreenFill,
    color: theme.colors.signalGreenText,
  }),
}))
