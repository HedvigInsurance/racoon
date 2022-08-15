import styled from '@emotion/styled'
import { STEP_ICON_SIZE } from './PriceCalculatorForm.constants'

export const StepIconDefault = styled.div(({ theme }) => ({
  width: STEP_ICON_SIZE,
  height: STEP_ICON_SIZE,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderColor: theme.colors.gray800,
  borderWidth: 'thin',
  borderStyle: 'solid',
  fontSize: theme.fontSizes[1],
  boxShadow: `inset 0 0.5px 0 ${theme.colors.gray800}, inset 0 -0.5px 0 ${theme.colors.gray800}, inset 0.5px 0 0 ${theme.colors.gray800}, inset -0.5px 0 0 ${theme.colors.gray800}`,
}))
