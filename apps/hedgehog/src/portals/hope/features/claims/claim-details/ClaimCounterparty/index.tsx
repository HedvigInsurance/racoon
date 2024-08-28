import { Button, CardContent, CardTitle, Flex, Tab } from '@hedvig-ui'
import { CounterpartyDetails } from '@hope/features/claims/claim-details/ClaimCounterparty/CounterpartyDetails'
import { CreateCounterpartyModal } from '@hope/features/claims/claim-details/ClaimCounterparty/CreateCounterpartyModal'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useClaim } from '@hope/features/claims/hooks/use-claim'

const TabsWrapper = styled(Flex)`
  align-items: flex-end;
  overflow: hidden;
  margin: 1rem 0;
`

const FillWithBorder = styled.div`
  width: 100%;
  flex-shrink: 0;
  ${({ theme }) => `
    border-bottom: 1px solid ${theme.border};
  `}
`

export const ClaimCounterparty = () => {
  const { claimId, counterparties = [], agreement } = useClaim()
  const memberReference = agreement?.registrationNumber ?? ''

  const [selectedCounterpartyId, setSelectedCounterpartyId] = useState(
    counterparties.length ? counterparties[0].id : '',
  )
  const selectedCounterparty = counterparties.find(
    (counterparty) => counterparty.id === selectedCounterpartyId,
  )
  const [prevNrOfCounterparties, setPrevNrOfCounterparties] = useState(
    counterparties.length ?? 0,
  )
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!counterparties.length) return setSelectedCounterpartyId('')
    if (counterparties.length === prevNrOfCounterparties) return

    setSelectedCounterpartyId(counterparties[counterparties.length - 1].id)
    setPrevNrOfCounterparties(counterparties.length)
  }, [counterparties.length, counterparties, prevNrOfCounterparties])

  return (
    <CardContent>
      <Flex justify="space-between">
        <CardTitle title="Counterparties" />
        <Button onClick={() => setCreating(true)}>+ New</Button>
      </Flex>
      {!!counterparties.length && (
        <TabsWrapper>
          {counterparties.map((counterparty) => (
            <Tab
              key={counterparty.id}
              style={{ padding: '0 1rem 0.5rem 1rem' }}
              active={counterparty.id === selectedCounterpartyId}
              action={() => setSelectedCounterpartyId(counterparty.id)}
              title={counterparty.reference}
            />
          ))}
          <FillWithBorder />
        </TabsWrapper>
      )}
      {!!selectedCounterparty && (
        <CounterpartyDetails
          memberReference={memberReference}
          counterparty={selectedCounterparty}
        />
      )}
      <CreateCounterpartyModal
        visible={creating}
        onClose={() => setCreating(false)}
        claimId={claimId}
      />
    </CardContent>
  )
}
