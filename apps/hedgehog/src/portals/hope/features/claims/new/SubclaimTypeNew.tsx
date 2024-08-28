import { extractErrorMessage } from '@hedvig-ui'
import { toast } from 'react-hot-toast'
import {
  ClaimSubclaimFragment,
  ClaimType,
  useSetSubclaimTypeMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import { useSetSubclaimReserve } from '@hope/common/hooks/use-set-subclaim-reserve'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { Dropdown, Flex } from '@hedvig-ui/redesign'
import { ClaimPropertyFormNew } from './ClaimPropertyFormNew'

gql`
  mutation SetSubclaimType($subclaimId: ID!, $type: String) {
    subclaim_setType(subclaimId: $subclaimId, type: $type) {
      ...ClaimSubclaim
    }
  }

  mutation SetSubclaimPropertySelection(
    $subclaimId: ID!
    $type: String!
    $propertyId: ID!
    $optionIds: [ID!]!
  ) {
    subclaim_setPropertySelection(
      subclaimId: $subclaimId
      type: $type
      propertyId: $propertyId
      optionIds: $optionIds
    ) {
      ...ClaimSubclaim
    }
  }
`

export const SubclaimTypeNew = ({ subclaimId }: { subclaimId: string }) => {
  const { preferredCurrency, getSubclaim, contract } = useClaim()
  const [setClaimType] = useSetSubclaimTypeMutation()
  const subclaim = getSubclaim(subclaimId) as ClaimSubclaimFragment
  const selectedClaimType = subclaim?.claimType
  const propertySelections = subclaim?.propertySelections ?? []
  const availableClaimTypes = contract?.availableClaimTypes ?? []

  const { maybeUpdateSubclaimReserves } = useSetSubclaimReserve()

  const handleSetClaimType = async (claimType: ClaimType) => {
    const result = await toast.promise(
      setClaimType({
        variables: { subclaimId: subclaimId, type: claimType.id },
        optimisticResponse: {
          subclaim_setType: {
            ...subclaim,
            __typename: 'Subclaim',
            id: subclaimId,
            type: claimType.id,
            claimType,
            propertySelections: [],
          },
        },
      }),
      {
        loading: 'Updating type...',
        success: 'Type updated',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
    if (!preferredCurrency || !result.data?.subclaim_setType) return
    await maybeUpdateSubclaimReserves({
      subclaims: [result.data?.subclaim_setType],
      preferredCurrency,
    })
  }

  const typeOptions = subclaim
    ? availableClaimTypes
        .toSorted((a, b) => a.displayName.localeCompare(b.displayName))
        .map((claimType) => ({
          value: claimType.id,
          label: claimType.displayName,
          selected: subclaim.type === claimType.id,
          action: () => handleSetClaimType(claimType),
        }))
    : []

  if (!subclaim) {
    return null
  }

  return (
    <Flex direction="column" gap="small">
      <Dropdown label="Type" options={typeOptions} searchable />
      {!!selectedClaimType && (
        <ClaimPropertyFormNew
          subclaimId={subclaimId}
          type={selectedClaimType.id}
          propertySelections={propertySelections}
        />
      )}
    </Flex>
  )
}
