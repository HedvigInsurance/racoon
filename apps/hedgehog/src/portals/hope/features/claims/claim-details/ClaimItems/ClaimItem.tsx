import {
  convertEnumToTitle,
  Flex,
  formatDistanceWithAccuracy,
  formatDistanceWithFraction,
  InfoTag,
  Monetary,
  Placeholder,
  Popover,
} from '@hedvig-ui'
import { useState } from 'react'
import {
  ClaimItem as TClaimItem,
  UpsertClaimItemInput,
} from 'types/generated/graphql'
import { ItemCard } from '.'
import { format, parseISO } from 'date-fns'
import { AddOrEditItem } from '@hope/features/claims/claim-details/ClaimItems/AddOrEditItem'
import { useClaimItems } from '@hope/features/claims/claim-details/ClaimItems/useClaimItems'
import { Trash } from 'react-bootstrap-icons'
import styled from '@emotion/styled'
import { useClaim } from '../../hooks/use-claim'
import { itemBrandDisplayName } from '@hope/features/config/displayNames'

const DeleteIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transition: color 200ms ease;

  &:hover {
    color: ${({ theme }) => theme.danger};
  }
`

export const ClaimItem = ({
  item,
  claimId,
}: {
  item: TClaimItem
  claimId: string
}) => {
  const { dateOfOccurrence } = useClaim()
  const { updateItem, removeItem } = useClaimItems()
  const [isEditing, setIsEditing] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  if (isEditing) {
    return (
      <AddOrEditItem
        formType="edit"
        initialValues={item}
        claimId={claimId}
        handleSubmit={(_, input: UpsertClaimItemInput) =>
          updateItem(item.id, input)
        }
        onClose={() => setIsEditing(false)}
      />
    )
  }
  return (
    <ItemCard
      style={{ cursor: 'pointer' }}
      onClick={() => {
        setIsEditing(true)
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Flex
        direction="column"
        gap="medium"
        justify="space-between"
        style={{ position: 'relative', height: '100%' }}
      >
        {isHovering && (
          <DeleteIcon
            onClick={async (e) => {
              e.stopPropagation()
              await removeItem(item)
            }}
          >
            <Popover contents="Remove item">
              <Trash />
            </Popover>
          </DeleteIcon>
        )}
        <Flex direction="column" gap="fraction" flex="0">
          <h3>
            {item.brand ? `${itemBrandDisplayName(item.brand)} - ` : ''}
            {item.modelName ?? item.customName ?? convertEnumToTitle(item.type)}
          </h3>
          <Flex gap="fraction">
            <InfoTag>{convertEnumToTitle(item.type)}</InfoTag>
            {item.brand && <InfoTag>{convertEnumToTitle(item.brand)}</InfoTag>}
          </Flex>
          {!!item.problems.length && (
            <Flex gap="fraction" style={{ flexWrap: 'wrap' }}>
              {item.problems.map((problem) => (
                <InfoTag key={problem} status="highlight">
                  {convertEnumToTitle(problem)}
                </InfoTag>
              ))}
            </Flex>
          )}
        </Flex>
        <Flex direction="column" gap="tiny" justify="flex-end">
          <Flex gap="tiny" justify="space-between" flex="0">
            Purchase date:
            <div>
              {item?.purchaseDate ? (
                <Popover
                  contents={
                    'Age ' +
                    (dateOfOccurrence
                      ? `${formatDistanceWithAccuracy(
                          parseISO(item.purchaseDate),
                          parseISO(dateOfOccurrence),
                        )} ~ ${formatDistanceWithFraction(
                          parseISO(item.purchaseDate),
                          parseISO(dateOfOccurrence),
                        )} years\n\n(compared to ${dateOfOccurrence})`
                      : 'unknown (date of occurrence not set)')
                  }
                >
                  {format(parseISO(item.purchaseDate), 'yyyy-MM-dd')}
                </Popover>
              ) : (
                <Placeholder>Not set</Placeholder>
              )}
            </div>
          </Flex>
          <Flex gap="tiny" justify="space-between" flex="0">
            Purchase price:
            {item.purchasePrice ? (
              <Monetary amount={item.purchasePrice} />
            ) : (
              <Placeholder>Not set</Placeholder>
            )}
          </Flex>
          <Flex gap="tiny" justify="space-between" flex="0">
            Automatic valuation:
            {item.valuation ? (
              <Monetary amount={item.valuation} />
            ) : (
              <Placeholder>None</Placeholder>
            )}
          </Flex>
        </Flex>
      </Flex>
    </ItemCard>
  )
}
