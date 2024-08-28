import {
  Button,
  Card,
  Dialog,
  Div,
  Flex,
  InfoTag,
  Tooltip,
} from '@hedvig-ui/redesign'
import { ComponentPropsWithoutRef, useState } from 'react'
import { itemType, removalConfirmationDescription } from './ClaimItem.css'
import { Claim, ItemModel, type ClaimItem } from 'types/generated/graphql'
import { ClaimItemDataPoint } from '../ClaimItemDataPoint/ClaimItemDataPoint'
import { format } from 'date-fns/format'
import { parseISO } from 'date-fns/parseISO'
import {
  calculationSection,
  compensationSection,
  itemDataPoints,
} from '../ClaimItems.css'
import { ClaimItemForm } from '../ClaimItemForm/ClaimItemForm'
import {
  Monetary,
  Spacing,
  convertEnumToSentence,
  convertEnumToTitle,
  formatDistanceWithFraction,
} from '@hedvig-ui'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { itemBrandDisplayName } from '@hope/features/config/displayNames'
import { useClaimItems } from '@hope/features/claims/claim-details/ClaimItems/useClaimItems'
import { MonetaryAmount } from 'types/scalars'
import clsx from 'clsx'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

interface Props extends ComponentPropsWithoutRef<typeof Card> {
  item: ClaimItem
}

function calculatePercentageDifference(
  originalValue: number,
  newValue: number,
): string {
  const percentageChange = ((newValue - originalValue) / originalValue) * 100
  return `${percentageChange.toFixed(2)}%`
}
function calculateMoneyDifference(
  a: MonetaryAmount,
  b: MonetaryAmount,
): MonetaryAmount {
  return {
    amount: a.amount - b.amount,
    currency: a.currency,
  }
}

export function ClaimItem({ item }: Props) {
  const {
    type,
    brand,
    modelName,
    itemModel,
    purchasePrice,
    purchaseDate,
    problems,
    valuationCalculation,
    repairCostCalculation,
    compensationCalculation,
  } = item

  const [isEditing, setIsEditing] = useState(false)

  const { dateOfOccurrence } = useClaim()

  const { updateItem, removeItem, isUpdaing, isRemoving } = useClaimItems({
    onUpdateComplete: () => setIsEditing(false),
  })

  const isPending = isUpdaing || isRemoving

  const itemName = item.modelName || item.customName

  return (
    <Card variant="secondary">
      <Flex justify="space-between">
        <div>
          <h3 className={itemType}>{convertEnumToTitle(type)}</h3>
          <Flex direction="row" gap="fraction" wrap="wrap">
            {problems.map((problem) => (
              <InfoTag key={problem} variant="warning">
                {convertEnumToSentence(problem)}
              </InfoTag>
            ))}
          </Flex>
        </div>
        <Dialog.Root open={isEditing} onOpenChange={setIsEditing}>
          <Dialog.Trigger asChild>
            <Button size="small" variant="secondary">
              Edit
            </Button>
          </Dialog.Trigger>

          <Dialog.Content>
            <ClaimItemForm
              item={item}
              onSubmit={(upsertItemInput) =>
                updateItem(item.id, upsertItemInput)
              }
            >
              <Button type="submit" loading={isUpdaing} disabled={isUpdaing}>
                Save
              </Button>

              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    loading={isRemoving}
                    disabled={isPending}
                  >
                    Remove
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Div p="lg">
                    <Flex direction="column" gap="md">
                      <Dialog.Title>Are you sure?</Dialog.Title>
                      <Dialog.Description
                        className={removalConfirmationDescription}
                      >
                        Do you want to remove the {itemName ?? 'item'}?
                      </Dialog.Description>
                    </Flex>
                    <Flex gap="xs" mt="lg" justify="end">
                      <Dialog.Close asChild>
                        <Button variant="secondary">Cancel</Button>
                      </Dialog.Close>

                      <Button
                        onClick={() =>
                          removeItem(item, { skipConfirmation: true })
                        }
                        loading={isRemoving}
                        disabled={isRemoving}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Div>
                </Dialog.Content>
              </Dialog.Root>
            </ClaimItemForm>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      <Flex gap="xxs" direction="column" className={itemDataPoints}>
        <ClaimItemDataPoint
          label="Brand"
          value={brand ? itemBrandDisplayName(brand) : null}
        />
        <ClaimItemDataPoint label="Model" value={modelName} />

        <ModelViewDialog itemModel={itemModel} />

        {!valuationCalculation === true && (
          <>
            <ClaimItemDataPoint
              label="Purchase price"
              value={
                purchasePrice ? <Monetary amount={purchasePrice} /> : 'Not set'
              }
            />
            <ClaimItemDataPoint
              label="Purchase date"
              value={
                purchaseDate
                  ? format(parseISO(purchaseDate), 'yyyy-MM-dd')
                  : 'Not set'
              }
            />
          </>
        )}
      </Flex>

      <ValuationCalculation
        dateOfOccurrence={dateOfOccurrence}
        purchaseDate={purchaseDate}
        calculation={valuationCalculation}
      />

      <RepairCostCalculation calculation={repairCostCalculation} />

      <CompensationCalculation calculation={compensationCalculation} />
    </Card>
  )
}

function ModelViewDialog({
  itemModel,
}: {
  itemModel: ItemModel | null | undefined
}) {
  if (!itemModel) {
    return null
  }
  return (
    <>
      <Spacing top="tiny" />
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="secondary-alt">View information about model</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Flex
            direction="column"
            gap="md"
            py="lg"
            px="xl"
            style={{ minWidth: '400px' }}
          >
            <div>
              <Dialog.Title>{itemModel.name}</Dialog.Title>
              <Dialog.Description>
                {convertEnumToTitle(itemModel.brand)}
              </Dialog.Description>
            </div>

            <Flex
              gap="xs"
              justify="space-between"
              pl="xxs"
              className={cssUtil.textMuted}
            >
              <span>Market price</span>
              {itemModel.repurchasePrice ? (
                <Monetary amount={itemModel.repurchasePrice} />
              ) : (
                'Not set'
              )}
            </Flex>

            {itemModel.repairInfos.length > 0 && (
              <div>
                <Flex mb="xs" justify="space-between">
                  <span>Available repairs</span>
                  <span>
                    {`Updated: ${format(
                      itemModel.repairInfos[0].createdAt,
                      'yyyy-MM-dd',
                    )}`}
                  </span>
                </Flex>

                {itemModel.repairInfos.map((repair) => (
                  <Flex
                    gap="xs"
                    justify="space-between"
                    mb="xxs"
                    pl="xxs"
                    className={cssUtil.textMuted}
                  >
                    <span>{convertEnumToSentence(repair.problem)}</span>
                    <span>
                      <Monetary amount={repair.cost} />
                    </span>
                  </Flex>
                ))}
              </div>
            )}

            <Flex justify="flex-end">
              <Dialog.Close asChild>
                <Button variant="secondary">Close</Button>
              </Dialog.Close>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

function ValuationCalculation(props: {
  dateOfOccurrence: Claim['dateOfOccurrence']
  purchaseDate: ClaimItem['purchaseDate']
  calculation: ClaimItem['valuationCalculation']
}) {
  if (!props.calculation) {
    return null
  }

  const canCalculateItemAge = props.purchaseDate && props.dateOfOccurrence
  const itemAge = canCalculateItemAge
    ? `${formatDistanceWithFraction(
        parseISO(props.purchaseDate),
        parseISO(props.dateOfOccurrence),
      )} years`
    : 'Unknown'
  const itemAgeDeduction = calculateMoneyDifference(
    props.calculation.price,
    props.calculation.amount,
  )
  const itemAgeDeductionPercentage = calculatePercentageDifference(
    props.calculation.price.amount,
    props.calculation.amount.amount,
  )

  return (
    <Flex gap="xxs" direction="column" className={calculationSection}>
      <ClaimItemDataPoint label="Purchase date" value={props.purchaseDate} />
      <ClaimItemDataPoint
        label="Valuation type"
        value={convertEnumToSentence(props.calculation.type)}
      />
      <ClaimItemDataPoint
        label="Price"
        value={<Monetary amount={props.calculation.price} />}
      />
      <ClaimItemDataPoint
        label="Age deduction"
        value={
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span>
                {`${itemAge}/ ${itemAgeDeductionPercentage}/ `}
                <Monetary amount={itemAgeDeduction} />
              </span>
            </Tooltip.Trigger>
            <Tooltip.Content>
              {canCalculateItemAge
                ? `Compared to ${props.dateOfOccurrence}`
                : 'Purchase or occurrence date is missing'}
            </Tooltip.Content>
          </Tooltip.Root>
        }
      />
      <ClaimItemDataPoint
        label="Valuation"
        value={<Monetary amount={props.calculation.amount} />}
      />
    </Flex>
  )
}

function RepairCostCalculation(props: {
  calculation: ClaimItem['repairCostCalculation']
}) {
  if (!props.calculation) {
    return null
  }
  return (
    <Flex gap="xxs" direction="column" className={calculationSection}>
      <ClaimItemDataPoint
        label="Covered repairs"
        value={props.calculation.coveredRepairs
          .map((repair) => convertEnumToSentence(repair.problem))
          .join(', ')}
      />
      <ClaimItemDataPoint
        label="Not covered repairs"
        value={props.calculation.notCoveredProblems
          .map(convertEnumToSentence)
          .join(', ')}
      />
      <ClaimItemDataPoint
        label="Repair cost"
        value={<Monetary amount={props.calculation.amount} />}
      />
    </Flex>
  )
}

function CompensationCalculation(props: {
  calculation: ClaimItem['compensationCalculation']
}) {
  if (!props.calculation) {
    return (
      <div className={clsx(calculationSection, compensationSection)}>
        No compensation suggestion available
      </div>
    )
  }
  return (
    <Flex
      gap="xxs"
      direction="column"
      className={clsx(calculationSection, compensationSection)}
    >
      <ClaimItemDataPoint
        label="Most suitable compensation"
        value={convertEnumToSentence(props.calculation.type)}
      />
      <ClaimItemDataPoint
        label="Compensation amount"
        value={<Monetary amount={props.calculation.amount} />}
      />
      <ClaimItemDataPoint
        label="Deductible"
        value={<Monetary amount={props.calculation.deductible} />}
      />
      <ClaimItemDataPoint
        label="Suggested payout"
        value={
          <Monetary
            amount={calculateMoneyDifference(
              props.calculation.amount,
              props.calculation.deductible,
            )}
          />
        }
      />
    </Flex>
  )
}
