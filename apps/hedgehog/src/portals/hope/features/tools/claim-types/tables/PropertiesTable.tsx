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
  ClaimProperty,
  GetClaimPropertiesDocument,
  GetClaimPropertiesQuery,
  useDeprecateClaimPropertyMutation,
  useGetClaimPropertiesQuery,
  useUpdateClaimPropertyMutation,
} from 'types/generated/graphql'
import { ApolloCache, NormalizedCacheObject } from '@apollo/client'

export const PropertiesTable: React.FC<{ filter: string }> = ({ filter }) => {
  const [updateProperty, { loading: updateLoading }] =
    useUpdateClaimPropertyMutation()
  const [deprecateProperty, { loading: deprecateLoading }] =
    useDeprecateClaimPropertyMutation()
  const [editing, setEditing] = useState<null | string>(null)
  const { data } = useGetClaimPropertiesQuery()
  const claimProperties = data?.claimProperties

  const isEscapePressed = useKeyIsPressed(Keys.Escape)

  useEffect(() => {
    if (isEscapePressed) {
      setEditing(null)
    }
  }, [isEscapePressed])

  if (!claimProperties) {
    return null
  }

  const handleUpdateProperty = (value: string, property: ClaimProperty) => {
    toast.promise(
      updateProperty({
        variables: { id: property.id, name: value },
        optimisticResponse: {
          updateClaimProperty: {
            id: property.id,
            __typename: 'ClaimProperty',
            name: value,
          },
        },
      }),
      {
        loading: 'Updating property',
        success: () => {
          setEditing(null)
          return 'Property updated'
        },
        error: 'Could not update property',
      },
    )
  }

  const handleDeprecateProperty = (property: ClaimProperty) => {
    toast.promise(
      deprecateProperty({
        variables: { id: property.id },
        update: (
          cache: ApolloCache<NormalizedCacheObject>,
          { data: response },
        ) => {
          if (!response) {
            return
          }
          const cachedData = cache.readQuery({
            query: GetClaimPropertiesDocument,
          })

          const cachedClaimProperties = (cachedData as GetClaimPropertiesQuery)
            .claimProperties

          cache.writeQuery({
            query: GetClaimPropertiesDocument,
            data: {
              claimProperties: cachedClaimProperties.filter(
                (claimProperty) => claimProperty.id !== property.id,
              ),
            },
          })
        },
      }),
      {
        loading: 'Deprecating property',
        success: () => {
          setEditing(null)
          return 'Property deprecated'
        },
        error: 'Could not deprecate property',
      },
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableHeaderColumn>Name</TableHeaderColumn>
      </TableHeader>

      <TableBody>
        {claimProperties
          .filter((type) =>
            filter
              ? type.name.toLowerCase().includes(filter.toLowerCase())
              : true,
          )
          .map((property) => (
            <TableRow
              key={property.id}
              onClick={() => property.id !== editing && setEditing(property.id)}
            >
              <TableColumn>
                {editing === property.id ? (
                  <Flex align="center">
                    <UpdateNameInput
                      initial={convertCamelcaseToTitle(property.name)}
                      disabled={updateLoading || deprecateLoading}
                      onSubmit={(value) =>
                        handleUpdateProperty(value, property)
                      }
                    />
                    <Button
                      onClick={() => handleDeprecateProperty(property)}
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
                  convertCamelcaseToTitle(property.name)
                )}
              </TableColumn>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
