import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { STEP_ICON_SIZE } from './PriceCalculator.constants'
import { TickIcon } from './TickIcon'

const StyledStep = styled.div(({ theme }) => ({
  width: STEP_ICON_SIZE,
  height: STEP_ICON_SIZE,
  borderRadius: '50%',
  backgroundColor: theme.colors.purple500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const StepIconValid = () => {
  const theme = useTheme()

  return (
    <StyledStep>
      <TickIcon size="1rem" color={theme.colors.gray900} />
    </StyledStep>
  )
}
