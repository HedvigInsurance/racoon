import { convertEnumToTitle, extractErrorMessage, Popover } from '@hedvig-ui'
import { toast } from 'react-hot-toast'
import {
  ClaimItemFragment,
  ClaimProperty,
  ClaimPropertyOption,
  ClaimPropertySelection,
  useGetClaimTypeTemplateQuery,
  useSetSubclaimPropertySelectionMutation,
} from 'types/generated/graphql'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import { InfoCircle } from 'react-bootstrap-icons'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { itemBrandDisplayName } from '@hope/features/config/displayNames'
import { InfoTag, Flex, Dropdown, LabeledText } from '@hedvig-ui/redesign'

export const ClaimPropertyFormNew: React.FC<{
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

          if (name === 'Item') {
            return (
              <LabeledText
                key={propertyId}
                label={`${name}${items.length > 1 ? 's' : ''}`}
              >
                {items.length || selectedOption ? (
                  <Flex gap="fraction" wrap="wrap">
                    {[
                      {
                        type: selectedOption?.option.name,
                        modelName: null,
                        customName: null,
                      },
                      ...items,
                    ].map((item, index) => {
                      if (!item.type) {
                        return null
                      }
                      return (
                        <InfoTag variant="info" key={index}>
                          {getItemDisplayName(item as ClaimItemFragment)}
                        </InfoTag>
                      )
                    })}
                  </Flex>
                ) : (
                  <Flex align="center" gap="small">
                    <span>None selected</span>
                    <Popover contents={`Use "Items" section above to add item`}>
                      <InfoCircle />
                    </Popover>
                  </Flex>
                )}
              </LabeledText>
            )
          }

          if (name === 'Travel') {
            return (
              <LabeledText key={propertyId} label="Location">
                {location ? (
                  <InfoTag variant="info">
                    {convertEnumToTitle(location)}
                  </InfoTag>
                ) : (
                  <Flex align="center" gap="small">
                    <span>None selected</span>
                    <Popover
                      contents={`Set location in "Claim information" above`}
                    >
                      <InfoCircle />
                    </Popover>
                  </Flex>
                )}
              </LabeledText>
            )
          }

          return (
            <Dropdown
              key={propertyId}
              label={name}
              options={[
                ...options.map((option) => ({
                  value: option.id,
                  label: convertEnumToTitle(option.name),
                  selected: option.id === selectedOption?.option.id,
                  action: () =>
                    handlePropertySelect({ id: propertyId, name }, option),
                })),
                {
                  value: 'not_specified',
                  label: 'Not specified',
                  selected: selectedOption === undefined,
                  action: () =>
                    handlePropertySelect({ id: propertyId, name }, null),
                },
              ]}
            />
          )
        })}
    </Flex>
  )
}

const getItemDisplayName = (item: ClaimItemFragment) => {
  if (item.modelName) {
    return item.modelName
  }

  if (!item.customName) {
    return convertEnumToTitle(item.type)
  }

  if (item.brand) {
    return `${itemBrandDisplayName(item.brand)} - ${item.customName}`
  }

  return item.customName
}
