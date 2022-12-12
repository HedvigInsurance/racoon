import styled from '@emotion/styled'

type Props = {
  filled: boolean
}

export const StepIcon = styled.div<Props>(({ theme, filled }) => ({
  width: '1rem',
  height: '1rem',
  borderRadius: '50%',
  borderColor: filled ? 'transparent' : theme.colors.gray600,
  borderWidth: 'thin',
  borderStyle: 'solid',
  backgroundColor: filled ? theme.colors.gray900 : 'transparent',
}))
