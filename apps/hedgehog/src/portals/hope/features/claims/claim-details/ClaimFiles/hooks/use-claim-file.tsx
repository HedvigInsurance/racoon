import gql from 'graphql-tag'
import {
  ClaimDetailsDocument,
  ClaimFileFragment,
  useDeleteClaimFileMutation,
  useUpdateClaimFileMutation,
} from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import { extractErrorMessage, useConfirmDialog } from '@hedvig-ui'

gql`
  mutation UpdateClaimFile($claimFileId: UUID!, $input: ClaimFileUpdateInput!) {
    claimFileUpdate(claimFileId: $claimFileId, input: $input) {
      ...ClaimFile
    }
  }
`

export const useClaimFile = (file: ClaimFileFragment) => {
  const [updateClaimFile] = useUpdateClaimFileMutation()
  const [deleteClaimFile] = useDeleteClaimFileMutation()
  const { confirm } = useConfirmDialog()

  const defaultFile = {
    displayName: file.displayName,
    folder: file.folder,
    note: file.note,
    isHandled: !!file.handledBy,
    isMemberAccessible: file.isMemberAccessible,
  }
  const updateDisplayName = (displayName: string) => {
    toast.promise(
      updateClaimFile({
        variables: {
          claimFileId: file.claimFileId,
          input: {
            ...defaultFile,
            displayName,
          },
        },
      }),
      {
        success: 'Filename updated',
        loading: 'Updating filename',
        error: 'Something went wrong',
      },
    )
  }

  const toggleIsHandled = () => {
    updateClaimFile({
      variables: {
        claimFileId: file.claimFileId,
        input: {
          ...defaultFile,
          isHandled: !defaultFile.isHandled,
        },
      },
    })
  }

  const updateFolder = (folder: string) => {
    toast.promise(
      updateClaimFile({
        variables: {
          claimFileId: file.claimFileId,
          input: {
            ...defaultFile,
            folder,
          },
        },
      }),
      {
        success: 'Folder updated',
        loading: 'Updating folder...',
        error: 'Something went wrong',
      },
    )
  }

  const updateNote = (note: string) => {
    toast.promise(
      updateClaimFile({
        variables: {
          claimFileId: file.claimFileId,
          input: {
            ...defaultFile,
            note,
          },
        },
      }),
      {
        success: 'Note updated',
        loading: 'Updating note...',
        error: 'Something went wrong',
      },
    )
  }

  const deleteFile = async () => {
    try {
      await confirm('Are you sure you want to delete this file?')
    } catch (e) {
      return
    }

    await toast.promise(
      deleteClaimFile({
        variables: {
          claimFileId: file.claimFileId,
        },
        refetchQueries: [
          {
            query: ClaimDetailsDocument,
            variables: { claimId: file.claimId },
          },
        ],
      }),
      {
        loading: 'Deleting file',
        success: () => {
          return 'File deleted'
        },
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return {
    updateDisplayName,
    toggleIsHandled,
    updateFolder,
    updateNote,
    deleteFile,
  }
}
