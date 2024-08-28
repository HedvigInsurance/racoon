import { Button, extractErrorMessage } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import gql from 'graphql-tag'
import { useDeleteClaimFileMutation } from 'types/generated/graphql'
import { Trash } from 'react-bootstrap-icons'

gql`
  mutation DeleteClaimFile($claimFileId: UUID!) {
    claimFileDelete(claimFileId: $claimFileId)
  }
`

export const DeleteButton: React.FC<{
  claimId: string
  claimFileId: string
  onDeleted: () => void
}> = ({ claimFileId, onDeleted }) => {
  const [deleteClaimFile, { loading }] = useDeleteClaimFileMutation()

  const { confirm } = useConfirmDialog()

  return (
    <Button
      disabled={loading}
      icon={<Trash />}
      status="danger"
      onClick={() => {
        confirm('Are you sure you want to delete this file?').then(() => {
          toast.promise(
            deleteClaimFile({
              variables: {
                claimFileId,
              },
            }),
            {
              loading: 'Deleting file',
              success: () => {
                onDeleted()
                return 'File deleted'
              },
              error: ({ message }) => extractErrorMessage(message),
            },
          )
        })
      }}
    />
  )
}
