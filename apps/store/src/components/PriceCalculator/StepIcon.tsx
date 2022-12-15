import isValidProp from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

type Props = {
  state: 'outline' | 'filled' | 'muted'
}

const checkProps = { shouldForwardProp: isValidProp }

export const StepIcon = styled(
  'div',
  checkProps,
)<Props>(({ theme, state }) => ({
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

  ...(state === 'muted' && {
    backgroundColor: theme.colors.gray600,
    borderColor: 'transparent',
  }),
}))
