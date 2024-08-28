import gql from 'graphql-tag'
import toast from 'react-hot-toast'
import { extractErrorMessage } from '@hedvig-ui'
import {
  CreateEntrypointInput,
  ListEntrypointsDocument,
  UpdateEntrypointInput,
  useCreateEntrypointMutation,
  useRemoveEntrypointMutation,
  useUpdateEntrypointMutation,
} from 'types/generated/graphql'

gql`
  mutation CreateEntrypoint($input: CreateEntrypointInput!) {
    entrypoint_create(input: $input) {
      ...Entrypoint
    }
  }

  mutation UpdateEntrypoint(
    $entrypointId: ID!
    $input: UpdateEntrypointInput!
  ) {
    entrypoint_update(entrypointId: $entrypointId, input: $input) {
      ...Entrypoint
    }
  }

  mutation RemoveEntrypoint($entrypointId: ID!) {
    entrypoint_remove(entrypointId: $entrypointId) {
      ...Entrypoint
    }
  }
`

export const useEntrypoint = () => {
  const [createEntrypointMutation, { loading: isCreatingEntrypoint }] =
    useCreateEntrypointMutation()
  const createEntrypoint = async (input: CreateEntrypointInput) => {
    return toast.promise(
      createEntrypointMutation({
        variables: { input },
        refetchQueries: [{ query: ListEntrypointsDocument }],
      }),
      {
        loading: 'Creating...',
        success: 'Created',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const [updateEntrypointMutation, { loading: isUpdatingEntrypoint }] =
    useUpdateEntrypointMutation()
  const updateEntrypoint = async (
    entrypointId: string,
    input: UpdateEntrypointInput,
  ) => {
    return toast.promise(
      updateEntrypointMutation({
        variables: { entrypointId, input },
        refetchQueries: [{ query: ListEntrypointsDocument }],
      }),
      {
        loading: 'Updating...',
        success: 'Updated',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const [removeEntrypointMutation, { loading: isRemovingEntrypoint }] =
    useRemoveEntrypointMutation()
  const removeEntrypoint = async (entrypointId: string) => {
    return toast.promise(
      removeEntrypointMutation({
        variables: { entrypointId },
        refetchQueries: [{ query: ListEntrypointsDocument }],
      }),
      {
        loading: 'Deactivating...',
        success: 'Deactivated',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return {
    createEntrypoint,
    isCreatingEntrypoint,
    updateEntrypoint,
    isUpdatingEntrypoint,
    removeEntrypoint,
    isRemovingEntrypoint,
  }
}
