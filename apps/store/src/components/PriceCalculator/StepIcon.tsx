import isValidProp from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { theme } from 'ui'

type Props = {
  state: 'outline' | 'filled' | 'valid'
}

const checkProps = { shouldForwardProp: isValidProp }

export const StepIcon = styled(
  'div',
  checkProps,
)<Props>(({ state }) => ({
  width: '1rem',
  height: '1rem',
  borderRadius: '50%',
  borderWidth: 'thin',
  borderStyle: 'solid',

  ...(state === 'outline' && {
    backgroundColor: 'transparent',
    borderColor: theme.colors.gray600,
  }),

  ...(state === 'filled' && {
    backgroundColor: theme.colors.gray900,
    borderColor: 'transparent',
  }),

  ...(state === 'valid' && {
    backgroundColor: theme.colors.greenElement,
    borderColor: 'transparent',
  }),
}))
