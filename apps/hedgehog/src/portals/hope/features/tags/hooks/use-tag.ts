import gql from 'graphql-tag'
import { useUpsertTagMutation } from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import { useConfirmDialog } from '@hedvig-ui'

gql`
  mutation UpsertTag($resourceId: ID!, $input: TagUpsertInput!) {
    tagUpsert(resourceId: $resourceId, input: $input) {
      id
      value
      note
    }
  }
`

export const useTag = (resourceId: string) => {
  const [upsertTagMutation] = useUpsertTagMutation()
  const { confirm } = useConfirmDialog()
  const upsertTag = (value: string, note: string) =>
    toast.promise(
      upsertTagMutation({
        variables: {
          resourceId,
          input: {
            value,
            note,
          },
        },
      }),
      {
        success: 'Updated',
        loading: 'Updating...',
        error: 'Something went wrong',
      },
    )

  const removeTag = async (value: string) => {
    await confirm('Are you sure you want to remove the tag?')
    await toast.promise(
      upsertTagMutation({
        variables: {
          resourceId: resourceId,
          input: {
            value,
            note: null,
          },
        },
      }),
      {
        success: 'Removed',
        loading: 'Removing...',
        error: 'Something went wrong',
      },
    )
  }

  return {
    removeTag,
    upsertTag,
  }
}
