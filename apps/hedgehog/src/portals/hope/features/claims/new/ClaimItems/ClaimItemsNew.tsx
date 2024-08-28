import { useClaim } from '../../hooks/use-claim'
import { Flex, Button, Card, Dialog } from '@hedvig-ui/redesign'
import { sectionTitle } from '../Overview/section.css'
import { itemsContainer } from './ClaimItems.css'
import { ClaimItem } from './ClaimItem/ClaimItem'
import { useState } from 'react'
import { ClaimItemForm } from './ClaimItemForm/ClaimItemForm'
import { useClaimItems } from '../../claim-details/ClaimItems/useClaimItems'

export const ClaimItemsNew = () => {
  const [isAddingNewItem, setIsAddingNewItem] = useState(false)

  const { claimId, items } = useClaim()
  const { addItem } = useClaimItems({
    onCreateComplete: () => setIsAddingNewItem(false),
  })

  const itemsCount = items.length

  return (
    <Card>
      <Flex justify="space-between">
        <h2 className={sectionTitle}>
          Items
          {itemsCount ? ` (${itemsCount})` : null}
        </h2>
        <Dialog.Root open={isAddingNewItem} onOpenChange={setIsAddingNewItem}>
          <Dialog.Trigger asChild>
            <Button size="small">Add new item</Button>
          </Dialog.Trigger>

          <Dialog.Content>
            <ClaimItemForm
              onSubmit={(upsertItemInput) => addItem(claimId, upsertItemInput)}
            >
              <Button type="submit">Add</Button>
            </ClaimItemForm>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
      <div className={itemsContainer}>
        {items.map((item) => (
          <ClaimItem key={item.id} item={item} />
        ))}
      </div>
    </Card>
  )
}
