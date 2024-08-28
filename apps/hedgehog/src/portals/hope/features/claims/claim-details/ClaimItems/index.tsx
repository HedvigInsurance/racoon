import { useState } from 'react'
import {
  Button,
  CardContent as _CardContent,
  CardTitle,
  InfoSection,
} from '@hedvig-ui'
import styled from '@emotion/styled'
import { AddOrEditItem } from './AddOrEditItem'
import { useClaimItems } from './useClaimItems'
import { ClaimItem } from '@hope/features/claims/claim-details/ClaimItems/ClaimItem'
import { PlusLg } from 'react-bootstrap-icons'
import { useClaim } from '../../hooks/use-claim'

const CardContent = styled(_CardContent)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const CardList = styled.div`
  display: grid;
  gap: 1rem;
  flex-wrap: wrap;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
`

export const ItemCard = styled(InfoSection)`
  margin: 0;
  padding: 1rem;
  flex-direction: column;
  cursor: pointer;
  transition: transform 200ms ease;
  min-height: 10rem;

  &:hover {
    transform: scale(1.02);
  }

  & * {
    margin: 0;
    transition: none;
  }
`

const AddItemCard = styled(ItemCard)`
  display: grid;
  place-items: center;
  font-size: ${({ theme }) => theme.fontSize.huge};
  color: ${({ theme }) => theme.mutedText};
  transition:
    transform 200ms ease,
    color 200ms ease,
    font-weight 200ms ease;

  &:hover {
    color: ${({ theme }) => theme.success};
    font-weight: bold;
  }
`

export const ClaimItems = ({ claimId }: { claimId: string }) => {
  const { items } = useClaim()
  const { addItem } = useClaimItems()
  const [isAdding, setIsAdding] = useState(false)

  return (
    <CardContent>
      <CardTitle title="Items" />
      <CardList>
        {isAdding ? (
          <AddOrEditItem
            formType="add"
            claimId={claimId}
            handleSubmit={addItem}
            onClose={() => setIsAdding(false)}
          />
        ) : items?.length ? (
          <AddItemCard onClick={() => setIsAdding(true)}>
            <PlusLg />
          </AddItemCard>
        ) : (
          <Button
            style={{ width: 'max-content' }}
            onClick={() => setIsAdding(true)}
          >
            + Add
          </Button>
        )}
        {items.map((item) => (
          <ClaimItem key={item.id} item={item} claimId={claimId} />
        ))}
      </CardList>
    </CardContent>
  )
}
