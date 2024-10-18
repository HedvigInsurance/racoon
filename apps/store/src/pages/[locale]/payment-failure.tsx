import styled from '@emotion/styled'
import { WarningTriangleIcon } from 'ui/src/icons/WarningTriangleIcon'
import { theme } from 'ui/src/theme/theme'

export const PaymentFailurePage = () => {
  return (
    <Centered>
      <WarningTriangleIcon color={theme.colors.signalAmberElement} />
    </Centered>
  )
}

const Centered = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.lg,
  height: '100vh',
})

export default PaymentFailurePage
