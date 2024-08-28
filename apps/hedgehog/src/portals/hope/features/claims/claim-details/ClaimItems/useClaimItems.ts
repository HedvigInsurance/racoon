import {
  ClaimItemFragment,
  UpsertClaimItemInput,
  useAddClaimItemMutation,
  useRemoveClaimItemMutation,
  useUpdateClaimItemMutation,
} from 'types/generated/graphql'
import {
  extractErrorMessage,
  formatDistanceWithFraction,
  useConfirmDialog,
} from '@hedvig-ui'
import gql from 'graphql-tag'
import toast from 'react-hot-toast'
import { useClaim } from '../../hooks/use-claim'
import { parseISO } from 'date-fns'

gql`
  mutation AddClaimItem($claimId: ID!, $input: UpsertClaimItemInput!) {
    claim_addItem(claimId: $claimId, input: $input) {
      id
      items {
        ...ClaimItem
      }
    }
  }

  mutation UpdateClaimItem($itemId: ID!, $input: UpsertClaimItemInput!) {
    claimItem_update(itemId: $itemId, input: $input) {
      ...ClaimItem
    }
  }

  mutation RemoveClaimItem($itemId: ID!) {
    claimItem_remove(itemId: $itemId) {
      id
      items {
        ...ClaimItem
      }
    }
  }
`

type UseClaimItemsParams = {
  onCreateComplete?: () => void
  onUpdateComplete?: () => void
  onRemoveComplete?: () => void
}

export const useClaimItems = ({
  onCreateComplete,
  onUpdateComplete,
  onRemoveComplete,
}: UseClaimItemsParams = {}) => {
  const { confirm } = useConfirmDialog()
  const { dateOfOccurrence } = useClaim()

  const [addClaimItem, { loading: isAdding }] = useAddClaimItemMutation({
    onCompleted: onCreateComplete,
  })

  const [updateClaimItem, { loading: isUpdaing }] = useUpdateClaimItemMutation({
    onCompleted: onUpdateComplete,
  })

  const [removeClaimItem, { loading: isRemoving }] = useRemoveClaimItemMutation(
    {
      onCompleted: onRemoveComplete,
    },
  )

  const addItem = async (claimId: string, item: UpsertClaimItemInput) => {
    await toast.promise(addClaimItem({ variables: { claimId, input: item } }), {
      loading: 'Adding',
      success: 'Item added',
      error: ({ message }) => extractErrorMessage(message),
    })
  }

  const updateItem = async (itemId: string, item: UpsertClaimItemInput) => {
    await toast.promise(
      updateClaimItem({ variables: { itemId, input: item } }),
      {
        loading: 'Updating',
        success: 'Item updated',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const removeItem = async (
    item: ClaimItemFragment,
    { skipConfirmation = false } = {},
  ) => {
    const itemName = `${item?.modelName ?? item?.customName ?? ''}`
    try {
      if (!skipConfirmation) {
        await confirm(
          `Do you want to remove the ${itemName ?? 'item'}?`,
          'danger',
        )
      }

      await toast.promise(removeClaimItem({ variables: { itemId: item.id } }), {
        loading: 'Removing',
        success: 'Item removed',
        error: ({ message }) => extractErrorMessage(message),
      })
    } catch (err: unknown) {
      console.error(err)
    }
  }

  const itemAge = (item: ClaimItemFragment): string | undefined => {
    if (!dateOfOccurrence || !item.purchaseDate) return
    return formatDistanceWithFraction(
      parseISO(item.purchaseDate),
      parseISO(dateOfOccurrence),
    )
  }

  return {
    addItem,
    updateItem,
    removeItem,
    itemAge,
    isAdding,
    isUpdaing,
    isRemoving,
  }
}
