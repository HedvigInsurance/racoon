import { Button, ButtonsGroup, ThirdLevelHeadline } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui'
import * as React from 'react'
import Dropzone from 'react-dropzone'
import { toast } from 'react-hot-toast'
import {
  BACKOFFICE_BASE_URL,
  attachAuthHeader,
} from 'backoffice/backoffice.api'
import {
  GenericAgreement,
  useRegenerateCertificateMutation,
} from 'types/generated/graphql'

const uploadInsuranceCertificate = async ({
  agreementId,
  file,
}: {
  agreementId: string
  file: string | Blob
}) => {
  const body = new FormData()
  body.set('file', file)

  return fetch(
    `${BACKOFFICE_BASE_URL}/_/agreements/${agreementId}/certificates`,
    {
      method: 'POST',
      body,
      headers: {
        ...(await attachAuthHeader()),
      },
    },
  )
}

export const InsuranceCertificate: React.FC<{
  agreement: GenericAgreement
  onRefetch: () => void
}> = ({ agreement, onRefetch }) => {
  const [regenerateCertificate, { loading }] =
    useRegenerateCertificateMutation()

  const { confirm } = useConfirmDialog()

  return (
    <>
      <ThirdLevelHeadline>Insurance Certificate</ThirdLevelHeadline>
      <ButtonsGroup>
        {agreement.certificateUrl && (
          <Button
            onClick={() => {
              if (!agreement.certificateUrl) {
                return
              }

              window.open(agreement.certificateUrl, '_blank')
            }}
          >
            View
          </Button>
        )}
        <Button
          disabled={loading}
          variant="secondary"
          onClick={() => {
            confirm(
              'Are you sure you want to regenerate the certificate?',
            ).then(() => {
              toast.promise(
                regenerateCertificate({
                  variables: {
                    agreementId: agreement.id,
                  },
                }),
                {
                  loading: 'Regenerating certificate',
                  success: 'Certificate generated',
                  error: 'Could not regenerate certificate',
                },
              )
            })
          }}
        >
          Regenerate
        </Button>
        <Dropzone
          onDrop={(files) =>
            toast
              .promise(
                uploadInsuranceCertificate({
                  agreementId: agreement.id,
                  file: files[0],
                }),
                {
                  loading: 'Uploading certificate',
                  success: 'Certificate uploaded',
                  error: 'Could not upload certificate',
                },
              )
              .then(() => onRefetch())
          }
        >
          {({ getRootProps, getInputProps }) => {
            const { ref, ...props } = getRootProps()

            return (
              <Button variant="secondary" {...props}>
                <input {...getInputProps()} />
                Upload New
              </Button>
            )
          }}
        </Dropzone>
      </ButtonsGroup>
    </>
  )
}
