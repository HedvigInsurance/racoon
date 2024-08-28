import { Fragment, useState } from 'react'
import gql from 'graphql-tag'
import {
  Button,
  convertEnumToTitle,
  Dropdown,
  DropdownOption,
  extractErrorMessage,
  Flex,
  MultiDropdown,
  Spacing,
  Spinner,
  useConfirmDialog,
  useTitle,
} from '@hedvig-ui'
import {
  AddClaimStartVariantMutationVariables,
  EntrypointFragment,
  ListClaimStartVariantsDocument,
  ListClaimStartVariantsQuery,
  useAddClaimStartVariantMutation,
  useBindCommonClaimMutation,
  useBindEntrypointMutation,
  useGetClaimTypesQuery,
  useGetItemProblemsQuery,
  useListClaimStartVariantsQuery,
  useListItemTypesQuery,
} from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import { PcmsProvider, usePcms } from '@hope/common/pcms/usePcms'
import { useAllEntrypoints } from '@hope/pages/tools/entrypoints/hooks'
import styled from '@emotion/styled'

gql`
  mutation AddClaimStartVariant(
    $itemType: String
    $itemProblem: String
    $claimType: String
  ) {
    claimStartVariant_add(
      itemType: $itemType
      itemProblem: $itemProblem
      claimType: $claimType
    ) {
      ...ClaimStartVariant
    }
  }

  query ListClaimStartVariants {
    claimStartVariants {
      ...ClaimStartVariant
    }
  }

  mutation BindCommonClaim($commonClaimId: ID!, $claimStartVariantId: ID) {
    claimStartVariant_bindCommonClaim(
      commonClaimId: $commonClaimId
      claimStartVariantId: $claimStartVariantId
    )
  }

  mutation BindEntrypoint($entrypointId: ID!, $claimStartVariantId: ID) {
    claimStartVariant_bindEntrypoint(
      entrypointId: $entrypointId
      claimStartVariantId: $claimStartVariantId
    )
  }

  fragment ClaimStartVariant on ClaimStartVariant {
    id
    itemType
    itemProblem
    claimType
    commonClaimIds
    entrypoints {
      id
      displayName
    }
  }
`

const useClaimStartVariant = () => {
  const { confirm } = useConfirmDialog()
  const [addClaimStartVariantMutation] = useAddClaimStartVariantMutation()
  const [bindCommonClaimMutation] = useBindCommonClaimMutation()
  const [bindEntrypointMutation] = useBindEntrypointMutation()
  const { data: { itemModelTypes } = {} } = useListItemTypesQuery()
  const { data: { itemProblems } = {} } = useGetItemProblemsQuery()
  const { data: { claimTypes } = {} } = useGetClaimTypesQuery()

  const addClaimStartVariant = async (
    variables: AddClaimStartVariantMutationVariables,
  ) => {
    await confirm('Add new claim start variant?')
    return toast.promise(
      addClaimStartVariantMutation({
        variables,
        update: (cache, { data }) => {
          const newClaimStartVariant = data?.claimStartVariant_add
          if (!newClaimStartVariant) return
          const cachedClaimStartVariants =
            (
              cache.readQuery({
                query: ListClaimStartVariantsDocument,
              }) as ListClaimStartVariantsQuery
            )?.claimStartVariants ?? []
          cache.writeQuery({
            query: ListClaimStartVariantsDocument,
            data: {
              claimStartVariants: [
                ...cachedClaimStartVariants,
                newClaimStartVariant,
              ],
            },
          })
        },
      }),
      {
        success: 'Added!',
        loading: 'Adding...',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const toggleBind = async (
    inputVariables: { claimStartVariantId?: string } & (
      | { entrypointId: string }
      | { commonClaimId: string }
    ),
  ) => {
    const variables = { claimStartVariantId: null, ...inputVariables }
    const refetchQueries = [{ query: ListClaimStartVariantsDocument }]

    if ('entrypointId' in variables) {
      return toast.promise(
        bindEntrypointMutation({ variables, refetchQueries }),
        {
          success: variables.claimStartVariantId === null ? 'Removed' : 'Bound',
          loading:
            variables.claimStartVariantId === null ? 'Removing...' : 'Removed',
          error: ({ message }) => extractErrorMessage(message),
        },
      )
    }
    return toast.promise(
      bindCommonClaimMutation({ variables, refetchQueries }),
      {
        success: variables.claimStartVariantId === null ? 'Removed' : 'Bound',
        loading:
          variables.claimStartVariantId === null ? 'Removing...' : 'Removed',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return {
    addClaimStartVariant: addClaimStartVariant,
    toggleBind,
    itemTypes: itemModelTypes ?? [],
    itemProblems: itemProblems ?? [],
    claimTypes: claimTypes ?? [],
  }
}

const ClaimStartVariantsPage = () => (
  <PcmsProvider>
    <ClaimStartVariantsPageComponent />
  </PcmsProvider>
)

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr)) repeat(2, 2fr);
  gap: 1rem;
`

const ListHeader = styled(GridLayout)`
  padding-block: 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid lightgrey;
  font-weight: bold;
`

const sortEntrypointsByLocaleAndName = (
  a: EntrypointFragment,
  b: EntrypointFragment,
) => {
  return b.acceptLanguage.toLowerCase() < a.acceptLanguage.toLowerCase()
    ? 1
    : b.acceptLanguage.toLowerCase() === a.acceptLanguage.toLowerCase()
      ? b.displayName.toLowerCase() < a.displayName.toLowerCase()
        ? 1
        : -1
      : -1
}

const ClaimStartVariantsPageComponent = () => {
  useTitle('Claim start variants')
  const {
    addClaimStartVariant,
    itemTypes,
    itemProblems,
    claimTypes,
    toggleBind,
  } = useClaimStartVariant()
  const { allEntrypoints } = useAllEntrypoints()
  const { allCommonClaims, getCommonClaim } = usePcms()
  const [itemType, setItemType] = useState<string | null>(null)
  const [itemProblem, setItemProblem] = useState<string | null>(null)
  const [claimType, setClaimType] = useState<string | null>(null)

  const reset = () => {
    setItemType(null)
    setItemProblem(null)
    setClaimType(null)
  }

  const { data } = useListClaimStartVariantsQuery()
  if (!data?.claimStartVariants) return <Spinner />
  const claimStartVariants = data.claimStartVariants

  return (
    <div>
      <Flex gap="small">
        <Dropdown placeholder="Item problem" style={{ width: '12rem' }}>
          {itemProblems.map((problem) => (
            <DropdownOption
              key={problem.name}
              onClick={() => setItemProblem(problem.name)}
              selected={itemProblem == problem.name}
            >
              {convertEnumToTitle(problem.name)}
            </DropdownOption>
          ))}
        </Dropdown>
        <Dropdown placeholder="Item type" style={{ width: '12rem' }}>
          {itemTypes.map((type) => (
            <DropdownOption
              key={type.name}
              onClick={() => setItemType(type.name)}
              selected={itemType == type.name}
            >
              {type.displayName}
            </DropdownOption>
          ))}
        </Dropdown>
        <Dropdown placeholder="Claim type" style={{ width: '16rem' }}>
          {claimTypes.map((type) => (
            <DropdownOption
              key={type}
              onClick={() => setClaimType(type)}
              selected={claimType == type}
            >
              {convertEnumToTitle(type)}
            </DropdownOption>
          ))}
        </Dropdown>
        <Button
          disabled={!itemType && !itemProblem && !claimType}
          onClick={() =>
            addClaimStartVariant({
              itemType,
              itemProblem,
              claimType,
            }).finally(reset)
          }
        >
          Add +
        </Button>
      </Flex>

      <Spacing top="large" />

      <div>
        <ListHeader>
          <div>Item Problem</div>
          <div>Item Type</div>
          <div>Claim Type</div>
          <div>Entrypoints</div>
          <div>Common claims</div>
        </ListHeader>
        <GridLayout>
          {claimStartVariants.map((variant) => (
            <Fragment key={variant.id}>
              <div>
                {variant?.itemProblem &&
                  convertEnumToTitle(variant.itemProblem)}
              </div>
              <div>
                {variant?.itemType && convertEnumToTitle(variant.itemType)}
              </div>
              <div>
                {variant?.claimType && convertEnumToTitle(variant.claimType)}
              </div>
              <div>
                <MultiDropdown
                  placeholder="Add"
                  options={
                    [...allEntrypoints]
                      .sort((a, b) => sortEntrypointsByLocaleAndName(a, b))
                      .map(({ id, displayName, acceptLanguage }) => ({
                        key: id,
                        value: id,
                        text: `${displayName} (${acceptLanguage})`,
                      })) ?? []
                  }
                  value={variant.entrypoints.map(({ id, displayName }) => ({
                    key: id,
                    value: id,
                    text: displayName,
                  }))}
                  onChange={(value) =>
                    toggleBind({
                      entrypointId: value,
                      claimStartVariantId: variant.entrypoints.find(
                        ({ id }) => id === value,
                      )?.id
                        ? undefined
                        : variant.id,
                    })
                  }
                  clearHandler={() =>
                    variant.entrypoints.forEach(({ id }) =>
                      toggleBind({
                        entrypointId: id,
                      }),
                    )
                  }
                />
              </div>
              <div>
                <MultiDropdown
                  placeholder="Add"
                  options={
                    allCommonClaims?.map((commonClaim) => ({
                      key: String(commonClaim.id),
                      value: String(commonClaim.id),
                      text: commonClaim.attributes.title,
                    })) ?? []
                  }
                  value={variant.commonClaimIds.map((id, index) => {
                    const commonClaim = getCommonClaim(Number(id))
                    return {
                      key: String(commonClaim?.id ?? index),
                      value: String(commonClaim?.id ?? ''),
                      text: commonClaim?.attributes.title ?? 'Not found',
                    }
                  })}
                  onChange={(value) =>
                    toggleBind({
                      commonClaimId: value,
                      claimStartVariantId: variant.commonClaimIds.find(
                        (id) => id === value,
                      )
                        ? undefined
                        : variant.id,
                    })
                  }
                  clearHandler={() =>
                    variant.commonClaimIds.forEach((id) =>
                      toggleBind({ commonClaimId: id }),
                    )
                  }
                />
              </div>
            </Fragment>
          ))}
        </GridLayout>
      </div>
    </div>
  )
}

export default ClaimStartVariantsPage
