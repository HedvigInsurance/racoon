import isValidProp from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { theme } from 'ui'

type Props = {
  state: 'muted' | 'filled' | 'valid'
}

const checkProps = { shouldForwardProp: isValidProp }

export const StepIcon = styled(
  'div',
  checkProps,
)<Props>(({ state }) => ({
  width: '1rem',
  height: '1rem',
  borderRadius: '50%',

  ...(state === 'muted' && {
    backgroundColor: theme.colors.textTertiary,
  }),

  ...(state === 'filled' && {
    backgroundColor: theme.colors.textPrimary,
  }),

  ...(state === 'valid' && {
    backgroundColor: theme.colors.signalGreenElement,
  }),
}))
