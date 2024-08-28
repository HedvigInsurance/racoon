import { extractErrorMessage, Flex, SearchableDropdown } from '@hedvig-ui'
import { ClaimPropertyForm } from '@hope/features/claims/claim-details/ClaimSubclaims/components/SubclaimType/components/ClaimPropertyForm'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  ClaimSubclaimFragment,
  useSetSubclaimTypeMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import { useSetSubclaimReserve } from '@hope/common/hooks/use-set-subclaim-reserve'
import { useClaim } from '@hope/features/claims/hooks/use-claim'

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

export const SubclaimType: React.FC<{ subclaimId: string }> = ({
  subclaimId,
}) => {
  const { preferredCurrency, getSubclaim, contract } = useClaim()
  const [setClaimType] = useSetSubclaimTypeMutation()
  const subclaim = getSubclaim(subclaimId) as ClaimSubclaimFragment
  const selectedClaimType = subclaim?.claimType
  const propertySelections = subclaim?.propertySelections ?? []
  const availableClaimTypes = contract?.availableClaimTypes ?? []

  const { maybeUpdateSubclaimReserves } = useSetSubclaimReserve()

  const handleSetClaimType = async (newType: string) => {
    const claimType = availableClaimTypes.find((type) => type.id === newType)

    if (!claimType) {
      return
    }

    PushUserAction('claim', 'update', 'type', claimType.id)

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

  return (
    <Flex direction="column" justify="space-between">
      <div style={{ width: '100%' }}>
        <SearchableDropdown
          value={selectedClaimType?.id}
          placeholder="What type of claim is this?"
          isClearable={false}
          onChange={(selection) =>
            selection && handleSetClaimType(selection.value as string)
          }
          noOptionsMessage={() => 'No types found'}
          options={[...availableClaimTypes]
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
            .map((claimType) => ({
              value: claimType.id,
              label: claimType.displayName,
              searchTerms: claimType.id,
            }))}
          inputId="claim-type-dropdown"
        />
        {!!selectedClaimType && (
          <ClaimPropertyForm
            subclaimId={subclaimId}
            type={selectedClaimType.id}
            propertySelections={propertySelections}
          />
        )}
      </div>
    </Flex>
  )
}
