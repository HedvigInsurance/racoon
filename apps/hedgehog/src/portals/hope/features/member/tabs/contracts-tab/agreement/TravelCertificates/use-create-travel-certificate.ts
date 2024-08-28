import toast from 'react-hot-toast'
import { extractErrorMessage, useConfirmDialog } from '@hedvig-ui'
import { useCreateTravelCertificateMutation } from 'types/generated/graphql'
import { formatDate } from 'date-fns/format'
import gql from 'graphql-tag'

gql`
  mutation CreateTravelCertificate(
    $contractId: ID!
    $input: ContractTravelCertificateCreateInput!
  ) {
    contractTravelCertificateCreate(contractId: $contractId, input: $input) {
      id
      travelCertificates {
        id
        startDate
        endDate
        expiryDate
        url
      }
    }
  }
`

export type CoInsured = {
  fullName: string
  ssn: string
}

type CreateTravelCertificateInput = {
  contractId: string
  includedCoInsured: CoInsured[]
  startDate: Date
  endDate: Date | null
  isMemberIncluded: boolean
}

export const useCreateTravelCertificate = () => {
  const [createTravelCertificateMutation, { loading: isCreating }] =
    useCreateTravelCertificateMutation()
  const { confirm } = useConfirmDialog()
  const create = ({
    contractId,
    includedCoInsured,
    startDate,
    endDate,
    isMemberIncluded,
  }: CreateTravelCertificateInput) => {
    confirm(
      `Create travel certificate valid from ${formatDate(
        startDate,
        'yyyy-MM-dd',
      )}${
        isMemberIncluded
          ? ` covering the member and ${
              includedCoInsured.length ? includedCoInsured.length : 'no'
            } co insured`
          : includedCoInsured.length
            ? ` for ${includedCoInsured.length} co insured, do not include the member.`
            : ''
      }`,
    ).then(() =>
      toast.promise(
        createTravelCertificateMutation({
          variables: {
            contractId,
            input: {
              coInsured: includedCoInsured,
              startDate: formatDate(startDate, 'yyyy-MM-dd'),
              endDate: endDate ? formatDate(endDate, 'yyyy-MM-dd') : null,
              isMemberIncluded,
            },
          },
        }),
        {
          loading: 'Creating',
          success: 'Certificate created',
          error: ({ message }) => extractErrorMessage(message),
        },
      ),
    )
  }

  return { create, isCreating }
}
