import { Paragraph, Shadowed, StandaloneMessage } from '@hedvig-ui'
import styled from '@emotion/styled'

const NoCarrierMessage = styled(StandaloneMessage)`
  padding: 3em 0;
  text-align: center;
`

const NoCarrierSubtitle = styled(Paragraph)`
  font-size: 0.8em;
  padding-top: 1em;
`

export const NoCarrierPaymentPlaceholder = () => {
  return (
    <NoCarrierMessage opacity={0.6}>
      Cannot make a payment without a carrier.
      <NoCarrierSubtitle>
        Select a <Shadowed>Contract</Shadowed> and{' '}
        <Shadowed>Date of Occurrence</Shadowed> such that the claim is covered
        on the date.
      </NoCarrierSubtitle>
    </NoCarrierMessage>
  )
}

export const ReserverPlaceholder = () => {
  return (
    <NoCarrierMessage opacity={0.6}>
      Cannot set a reserve without a carrier.
      <NoCarrierSubtitle>
        Select a <Shadowed>Contract</Shadowed> and{' '}
        <Shadowed>Date of Occurrence</Shadowed> such that the claim is covered
        on the date.
      </NoCarrierSubtitle>
    </NoCarrierMessage>
  )
}
