import {
  Button,
  CalculatingInput,
  CardTitle,
  convertEnumToTitle,
  Flex,
  InfoSection,
  Input,
  Label,
  MultiDropdown,
  SearchableDropdown,
  Spacing,
  Spinner,
  TextDatePicker,
} from '@hedvig-ui'
import { ClaimItem, UpsertClaimItemInput } from 'types/generated/graphql'
import styled from '@emotion/styled'
import { FormEvent } from 'react'
import { useAddOrEditItemForm } from '@hope/features/claims/claim-details/ClaimItems/useAddOrEditItemForm'

const FlexGroup = styled(Flex)`
  gap: 1.5rem;

  & > * {
    flex: 1;
  }
`

const AddOrEditItemCard = styled(InfoSection)`
  margin: 0;
  padding: 1rem;
`

type AddOrEditItemProps = {
  formType: 'add' | 'edit'
  claimId: string
  handleSubmit: (claimId: string, item: UpsertClaimItemInput) => void
  initialValues?: ClaimItem
  onClose: () => void
}

export const AddOrEditItem = ({
  formType,
  initialValues,
  claimId,
  handleSubmit,
  onClose,
}: AddOrEditItemProps) => {
  const {
    formValues,
    handleFormChange,
    preferredCurrency,
    itemModels,
    itemModelTypes,
    itemModelBrands,
    itemProblems,
    customNameRef,
    clearProblems,
  } = useAddOrEditItemForm({
    initialValues,
    formType,
  })

  const handleSubmitItem = (e: FormEvent) => {
    e.preventDefault()
    const submitValues = { ...formValues }

    if (submitValues.modelId) {
      submitValues.type = null
      submitValues.brand = null
      submitValues.customName = null
    }

    handleSubmit(claimId, submitValues)
    onClose()
  }

  if (!itemModelTypes?.length)
    return (
      <AddOrEditItemCard style={{ gridColumn: '1/-1', alignItems: 'center' }}>
        <Spinner />
      </AddOrEditItemCard>
    )

  return (
    <AddOrEditItemCard style={{ gridColumn: '1/-1' }}>
      <CardTitle
        title={`${convertEnumToTitle(formType)} ${
          initialValues?.modelName ?? initialValues?.customName ?? 'item'
        }`}
      />
      <Spacing top="small" />
      <form onSubmit={handleSubmitItem}>
        <Flex direction="column" gap="medium">
          <FlexGroup>
            <div>
              <Label>Item</Label>
              <SearchableDropdown
                value={formValues?.type}
                placeholder="Select item"
                onChange={(option) => {
                  if (!option?.value) return
                  handleFormChange(option.value.toString(), 'type')
                }}
                options={itemModelTypes.map(({ name, displayName }) => ({
                  value: name,
                  label: displayName,
                }))}
              />
            </div>
            <div>
              <Label>Brand (Optional)</Label>
              <SearchableDropdown
                value={formValues?.brand ?? undefined}
                placeholder="Select brand"
                onChange={(option) => {
                  if (!option?.value) return
                  handleFormChange(option?.value?.toString(), 'brand')
                }}
                options={[
                  ...itemModelBrands.map(({ name, displayName }) => ({
                    value: name,
                    label: displayName,
                  })),
                ]}
              />
            </div>
            {!!itemModels?.length && (
              <div>
                <Label>Model (Optional)</Label>
                <SearchableDropdown
                  placeholder="Select model"
                  value={formValues.modelId}
                  options={[
                    { key: 'custom', value: '', label: 'Custom' },
                    ...(itemModels
                      ? itemModels.map(({ id, name }) => ({
                          key: id,
                          value: id,
                          label: name,
                        }))
                      : []),
                  ]}
                  onChange={(selection) =>
                    selection &&
                    handleFormChange(selection.value as string, 'modelId')
                  }
                />
              </div>
            )}
            {!formValues.modelId && (
              <div>
                <Label>Name (Optional)</Label>
                <Input
                  ref={customNameRef}
                  placeholder="What item is it?"
                  value={formValues.customName ?? ''}
                  onChange={(e) =>
                    handleFormChange(e.target.value, 'customName')
                  }
                />
              </div>
            )}
          </FlexGroup>

          <FlexGroup>
            <div>
              <Label>Problem (Optional)</Label>
              <MultiDropdown
                style={{ padding: '0.75rem 1rem' }}
                placeholder="What is the problem?"
                options={itemProblems?.map(({ name }) => name) ?? []}
                value={formValues.problems}
                onChange={(opt) => handleFormChange(opt, 'problems')}
                clearHandler={clearProblems}
              />
            </div>

            <div>
              <Label>Purchase date (Optional)</Label>
              <TextDatePicker
                value={formValues.purchaseDate}
                maxDate={new Date()}
                onChange={(newDate) =>
                  handleFormChange(newDate ?? '', 'purchaseDate')
                }
                placeholder="When was it purchased?"
              />
            </div>
            <div>
              <Label>Purchase price (Optional)</Label>
              <CalculatingInput
                placeholder="How much did it cost?"
                value={formValues?.purchasePrice?.amount ?? ''}
                onChange={(value) => handleFormChange(value, 'purchasePrice')}
                affix={{ content: preferredCurrency ?? '' }}
              />
            </div>
          </FlexGroup>

          <Flex gap="tiny" style={{ marginTop: '0.5rem' }}>
            <Button type="submit">
              {formType === 'edit' ? 'Save' : 'Add item'}
            </Button>
            <Button
              type="button"
              variant="tertiary"
              onClick={() => {
                onClose()
              }}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      </form>
    </AddOrEditItemCard>
  )
}
