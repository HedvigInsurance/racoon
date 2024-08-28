import {
  Button,
  Flex,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { Keys, useKeyIsPressed } from '@hedvig-ui'
import { convertCamelcaseToTitle } from '@hedvig-ui'
import { UpdateNameInput } from '@hope/features/tools/claim-types/tables/UpdateNameInput'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  ClaimPropertyOption,
  GetClaimPropertyOptionsDocument,
  GetClaimPropertyOptionsQuery,
  useDeprecateClaimPropertyOptionMutation,
  useGetClaimPropertyOptionsQuery,
  useUpdateClaimPropertyOptionMutation,
} from 'types/generated/graphql'
import { ApolloCache, NormalizedCacheObject } from '@apollo/client'

export const OptionsTable: React.FC<{ filter: string }> = ({ filter }) => {
  const [updateOption, { loading: updateLoading }] =
    useUpdateClaimPropertyOptionMutation()
  const [deprecateOption, { loading: deprecateLoading }] =
    useDeprecateClaimPropertyOptionMutation()
  const [editing, setEditing] = useState<null | string>(null)
  const { data } = useGetClaimPropertyOptionsQuery()
  const claimPropertyOptions = data?.claimPropertyOptions

  const isEscapePressed = useKeyIsPressed(Keys.Escape)

  useEffect(() => {
    if (isEscapePressed) {
      setEditing(null)
    }
  }, [isEscapePressed])

  if (!claimPropertyOptions) {
    return null
  }

  const handleUpdateOption = (value: string, option: ClaimPropertyOption) => {
    toast.promise(
      updateOption({
        variables: { id: option.id, name: value },
        optimisticResponse: {
          updateClaimPropertyOption: {
            id: option.id,
            __typename: 'ClaimPropertyOption',
            name: value,
          },
        },
      }),
      {
        loading: 'Updating option',
        success: () => {
          setEditing(null)
          return 'Option updated'
        },
        error: 'Could not update option',
      },
    )
  }

  const handleDeprecateOption = (option: ClaimPropertyOption) => {
    toast.promise(
      deprecateOption({
        variables: { id: option.id },
        update: (
          cache: ApolloCache<NormalizedCacheObject>,
          { data: response },
        ) => {
          if (!response) {
            return
          }
          const cachedData = cache.readQuery({
            query: GetClaimPropertyOptionsDocument,
          })

          const cachedClaimPropertyOptions = (
            cachedData as GetClaimPropertyOptionsQuery
          ).claimPropertyOptions

          cache.writeQuery({
            query: GetClaimPropertyOptionsDocument,
            data: {
              claimPropertyOptions: cachedClaimPropertyOptions.filter(
                (claimPropertyOption) => claimPropertyOption.id !== option.id,
              ),
            },
          })
        },
      }),
      {
        loading: 'Deprecating option',
        success: () => {
          setEditing(null)
          return 'Option deprecated'
        },
        error: 'Could not deprecate option',
      },
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableHeaderColumn>Name</TableHeaderColumn>
      </TableHeader>

      <TableBody>
        {claimPropertyOptions
          .filter((type) =>
            filter
              ? type.name.toLowerCase().includes(filter.toLowerCase())
              : true,
          )
          .map((option) => (
            <TableRow
              key={option.id}
              onClick={() => option.id !== editing && setEditing(option.id)}
            >
              <TableColumn>
                {editing === option.id ? (
                  <Flex align="center">
                    <UpdateNameInput
                      initial={convertCamelcaseToTitle(option.name)}
                      disabled={updateLoading || deprecateLoading}
                      onSubmit={(value) => handleUpdateOption(value, option)}
                    />
                    <Button
                      onClick={() => handleDeprecateOption(option)}
                      status="danger"
                      style={{ marginLeft: '1em' }}
                      disabled={deprecateLoading}
                    >
                      Deprecate
                    </Button>
                    <Button
                      onClick={() => setEditing(null)}
                      variant="tertiary"
                      style={{ marginLeft: '1em' }}
                    >
                      Cancel
                    </Button>
                  </Flex>
                ) : (
                  convertCamelcaseToTitle(option.name)
                )}
              </TableColumn>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
