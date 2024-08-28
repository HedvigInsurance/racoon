import {
  Capitalized,
  convertEnumToTitle,
  Dropdown,
  DropdownOption,
  extractErrorMessage,
  Flex,
  InfoRow,
  InfoTag,
  Label,
  Popover,
  Spacing,
} from '@hedvig-ui'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  ClaimProperty,
  ClaimPropertyOption,
  ClaimPropertySelection,
  useGetClaimTypeTemplateQuery,
  useSetSubclaimPropertySelectionMutation,
} from 'types/generated/graphql'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import styled from '@emotion/styled'
import { InfoCircle } from 'react-bootstrap-icons'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { itemBrandDisplayName } from '@hope/features/config/displayNames'

const StyledInfoTag = styled(InfoTag)`
  padding: 0.25rem 1rem;
`
export const ClaimPropertyForm: React.FC<{
  subclaimId: string
  type: string
  propertySelections: ClaimPropertySelection[]
}> = ({ subclaimId, type, propertySelections }) => {
  const { items, location } = useClaim()
  const [setSubclaimPropertySelection] =
    useSetSubclaimPropertySelectionMutation()
  const { data } = useGetClaimTypeTemplateQuery({
    variables: { claimType: type },
  })
  const properties = data?.claimTypeTemplate?.properties ?? []

  const handlePropertySelect = (
    property: ClaimProperty,
    option: ClaimPropertyOption | null,
  ) => {
    if (
      option &&
      propertySelections.find(
        (selection) =>
          selection.property.id === property.id &&
          selection.option.id === option.id,
      )
    ) {
      return
    }

    PushUserAction('claim', 'update', 'property_selection', null)

    toast.promise(
      setSubclaimPropertySelection({
        variables: {
          subclaimId,
          type,
          propertyId: property.id,
          optionIds: option?.id ? [option.id] : [],
        },
      }),
      {
        loading: 'Setting property selection...',
        success: 'Property selection set',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return (
    <Flex direction="column">
      {properties
        .slice(0)
        .reverse()
        .map(({ propertyId, name, options }) => {
          const selectedOption = propertySelections.find(
            (selection) => selection.property.id === propertyId,
          )

          return (
            <Spacing key={propertyId} top="small">
              {name === 'Item' ? (
                <>
                  <Label>
                    {name}
                    {!!items?.length && items.length > 1 && 's'}
                  </Label>
                  {items?.length || selectedOption ? (
                    <Flex gap="fraction" style={{ flexWrap: 'wrap' }}>
                      {[
                        {
                          type: selectedOption?.option.name,
                          modelName: null,
                          customName: null,
                        },
                        ...items,
                      ]?.map((item, index) => {
                        if (!item.type) {
                          return null
                        }
                        return (
                          <StyledInfoTag status="info" key={index}>
                            {item.modelName
                              ? item.modelName
                              : item.customName
                                ? item.brand
                                  ? `${itemBrandDisplayName(item.brand)} - ${
                                      item.customName
                                    }`
                                  : item.customName
                                : convertEnumToTitle(item.type)}
                          </StyledInfoTag>
                        )
                      })}
                    </Flex>
                  ) : (
                    <InfoRow>
                      None selected
                      <Popover
                        contents={`Use "Items" section above to add item`}
                      >
                        <InfoCircle />
                      </Popover>
                    </InfoRow>
                  )}
                </>
              ) : name === 'Travel' ? (
                <>
                  <Label>Location</Label>
                  {location ? (
                    <Flex>
                      <StyledInfoTag status="info">
                        {convertEnumToTitle(location)}
                      </StyledInfoTag>
                    </Flex>
                  ) : (
                    <InfoRow>
                      None selected
                      <Popover contents={`Set location in "Claim Info" above`}>
                        <InfoCircle />
                      </Popover>
                    </InfoRow>
                  )}
                </>
              ) : (
                <>
                  <Label>{name}</Label>
                  <Dropdown placeholder="Not specified">
                    {[
                      ...options.map((option) => ({
                        key: option.id,
                        value: option.id,
                        text: option.name,
                      })),
                      {
                        key: 'not_specified',
                        value: 'not_specified',
                        text: 'Not specified',
                      },
                    ].map((opt) => (
                      <DropdownOption
                        key={opt.key}
                        onClick={async () => {
                          const property = {
                            id: propertyId,
                            name,
                          }

                          if (opt.value === 'not_specified') {
                            handlePropertySelect(property, null)
                          }

                          const option = options.find((o) => o.id === opt.value)

                          if (!option) {
                            return
                          }

                          handlePropertySelect(property, option)
                        }}
                        selected={
                          opt.value === selectedOption?.option.id ||
                          (selectedOption === undefined &&
                            opt.value === 'not_specified' &&
                            false)
                        }
                      >
                        <Capitalized>{opt.text}</Capitalized>
                      </DropdownOption>
                    ))}
                  </Dropdown>
                </>
              )}
            </Spacing>
          )
        })}
    </Flex>
  )
}
