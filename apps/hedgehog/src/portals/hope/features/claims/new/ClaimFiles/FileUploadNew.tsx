import * as React from 'react'
import { FileEarmark, FileEarmarkArrowUpFill } from 'react-bootstrap-icons'
import Dropzone from 'react-dropzone'
import { toast } from 'react-hot-toast'
import {
  attachAuthHeader,
  BACKOFFICE_BASE_URL,
} from 'backoffice/backoffice.api'
import * as css from './ClaimFilesNew.css'
import { useApolloClient } from '@apollo/client'
import { ClaimDetailsDocument } from 'types/generated/graphql'

export const FileUploadNew: React.FC<{
  claimId: string
  memberId: string
}> = ({ claimId, memberId }) => {
  const client = useApolloClient()
  return (
    <Dropzone
      onDrop={(files) =>
        toast.promise(uploadClaimFiles({ claimId, memberId, files }), {
          loading: 'Uploading file',
          success: () => {
            client.refetchQueries({
              include: [ClaimDetailsDocument],
            })
            return 'File uploaded'
          },
          error: 'Could not upload file',
        })
      }
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <button {...getRootProps()} className={css.fileUploadDropzoneButton}>
          <div className={css.fileUploadDropzoneIcon}>
            {isDragActive ? <FileEarmarkArrowUpFill /> : <FileEarmark />}
          </div>
          <input {...getInputProps()} />
          Click here or drag files to upload
        </button>
      )}
    </Dropzone>
  )
}

async function uploadClaimFiles({
  claimId,
  memberId,
  files,
}: {
  claimId: string
  memberId: string
  files: File[]
}) {
  const body = new FormData()
  files.forEach((file) => {
    body.append('files', file)
  })
  body.append('memberId', memberId)
  return await fetch(
    `${BACKOFFICE_BASE_URL}/api/claims/${claimId}/claimFiles`,
    {
      method: 'POST',
      body,
      headers: {
        ...(await attachAuthHeader()),
      },
    },
  )
}
