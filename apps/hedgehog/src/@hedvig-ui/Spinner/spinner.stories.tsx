import styled from '@emotion/styled'
import { Spinner } from '@hedvig-ui'

export default {
  title: 'Spinner',
  component: Spinner,
}

export const StandardSpinner = () => <Spinner />

const BigColoredText = styled.div`
  color: ${({ theme }) => theme.danger};
  font-size: 5rem;
`
export const BigColoredSpinner = () => (
  <BigColoredText>
    <Spinner />
  </BigColoredText>
)
