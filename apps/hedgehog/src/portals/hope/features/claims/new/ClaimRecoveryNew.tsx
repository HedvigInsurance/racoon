import { Flex } from '@hedvig-ui'
import { CounterpartyDetails } from '@hope/features/claims/claim-details/ClaimCounterparty/CounterpartyDetails'
import { CreateCounterpartyModal } from '@hope/features/claims/claim-details/ClaimCounterparty/CreateCounterpartyModal'
import { useEffect, useState } from 'react'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { Button, Card, Tabs } from '@hedvig-ui/redesign'
import { SubclaimRecoveryNew } from '@hope/features/claims/new/SubclaimRecoveryNew'
import { PlusIcon } from '@hedvig-ui/icons'

export const ClaimRecoveryNew = () => {
  const { claimId, counterparties = [], subclaims, agreement } = useClaim()
  const relevantSubclaims = subclaims.filter(({ type }) => !!type)
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
    <Flex direction="column" gap="small" align="stretch">
      <Card>
        <Flex direction="column" gap="small" align="stretch">
          <Flex justify="space-between">
            <div>Counterparties</div>
            <Button onClick={() => setCreating(true)}>
              <PlusIcon /> New counterparty
            </Button>
          </Flex>
          {!!counterparties.length && (
            <Tabs
              list={counterparties.map((counterparty) => ({
                key: counterparty.id,
                active: counterparty.id === selectedCounterpartyId,
                action: () => setSelectedCounterpartyId(counterparty.id),
                title: counterparty.reference,
              }))}
            />
          )}
          {!!selectedCounterparty && (
            <div>
              <CounterpartyDetails
                memberReference={memberReference}
                counterparty={selectedCounterparty}
              />
            </div>
          )}
          <CreateCounterpartyModal
            visible={creating}
            onClose={() => setCreating(false)}
            claimId={claimId}
          />
        </Flex>
      </Card>
      {relevantSubclaims.map((subclaim) => (
        <Card key={subclaim.id}>
          <SubclaimRecoveryNew subclaimId={subclaim.id} />
        </Card>
      ))}
    </Flex>
  )
}
