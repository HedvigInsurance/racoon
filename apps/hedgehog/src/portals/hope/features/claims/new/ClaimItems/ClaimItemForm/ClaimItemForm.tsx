import { ChangeEvent, PropsWithChildren } from 'react'

import { Controller } from 'react-hook-form'

import { Spinner, convertEnumToTitle } from '@hedvig-ui'

import {
  Card,
  Dropdown,
  Flex,
  Input,
  TextDatePicker,
  MultiSelect,
} from '@hedvig-ui/redesign'

import { useClaim } from '@hope/features/claims/hooks/use-claim'

import { UpsertClaimItemInput, type ClaimItem } from 'types/generated/graphql'
import { useClaimItemForm } from './useClaimItemForm'

import { content, form, loadingIndicator } from './ClaimItemForm.css'
import toast from 'react-hot-toast'
import { evaluate } from 'mathjs'

type Props = {
  item?: ClaimItem
  onSubmit: (item: UpsertClaimItemInput) => void
}

const evaluatePrice = (currentValue?: string): number => {
  if (!currentValue) {
    return 0
  }

  try {
    return evaluate(currentValue)
  } catch (err) {
    console.error(err)
    toast.error('Not valid expression')
    return 0
  }
}

export function ClaimItemForm({
  item,
  children,
  onSubmit,
}: PropsWithChildren<Props>) {
  const { preferredCurrency } = useClaim()

  const {
    register,
    handleSubmit,
    resetField,
    watch,
    isLoading,
    control,
    itemTypes,
    itemBrands,
    itemModels,
    itemProblems,
  } = useClaimItemForm({
    item,
    onSubmit,
  })

  const selectedItemType = watch('type')
  const selectedBrandName = watch('brand')
  const selectedModelId = watch('modelId')
  const purchasePriceAmount = watch('purchasePriceAmount')

  const hasPurchasePrice = purchasePriceAmount || purchasePriceAmount === 0

  const itemTypeOptions = itemTypes.map(({ name, displayName }) => ({
    value: name,
    label: displayName,
    selected: selectedItemType === name,
    action: () => {
      resetField('brand', { defaultValue: null })
      resetField('modelId', { defaultValue: null })
    },
  }))

  const itemBrandOptions = itemBrands.map(({ name, displayName }) => ({
    value: name,
    label: displayName,
    selected: selectedBrandName === name,
    action: () => resetField('modelId', { defaultValue: null }),
  }))

  const itemModelOptions = [
    {
      value: 'custom',
      label: 'Custom',
      selected: selectedModelId === 'custom',
    },
    ...itemModels.map(({ id, name }) => ({
      value: id,
      label: name,
      selected: selectedModelId === id,
    })),
  ]

  return (
    <Card className={content}>
      {isLoading ? (
        <div className={loadingIndicator}>
          <Spinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={form}>
          <Flex direction="column" gap="sm">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Dropdown label="Type" options={itemTypeOptions} {...field} />
              )}
            />

            {itemBrands.length ? (
              <Controller
                control={control}
                name="brand"
                render={({ field }) => (
                  <Dropdown
                    label="Brand (optional)"
                    options={itemBrandOptions}
                    {...field}
                  />
                )}
              />
            ) : null}

            {itemModels.length ? (
              <Controller
                control={control}
                name="modelId"
                render={({ field }) => (
                  <Dropdown
                    label="Model (optional)"
                    options={itemModelOptions}
                    {...field}
                  />
                )}
              />
            ) : null}

            {!selectedModelId || selectedModelId === 'custom' ? (
              <Input
                label="Custom name (optional)"
                {...register('customName')}
              />
            ) : null}

            <Controller
              control={control}
              name="purchaseDate"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextDatePicker
                  label="Purchase date (optional)"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="purchasePriceAmount"
              render={({ field: { onChange, ...fieldProps } }) => (
                <Input
                  type="number"
                  label="Purchase price (optional)"
                  affix={{ content: preferredCurrency }}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const evaluatedPrice = evaluatePrice(event.target.value)
                    onChange(evaluatedPrice)
                  }}
                  {...fieldProps}
                />
              )}
            />

            {hasPurchasePrice ? (
              <input
                hidden
                {...register('purchasePriceCurrency', {
                  value: preferredCurrency,
                  shouldUnregister: true,
                })}
              />
            ) : null}

            <Controller
              control={control}
              name="problems"
              render={({ field }) => (
                <MultiSelect
                  label="Problems (optional)"
                  options={itemProblems.map((problem) => ({
                    value: problem.name,
                    label: convertEnumToTitle(problem.name),
                  }))}
                  {...field}
                />
              )}
            />
          </Flex>

          <Flex mt="lg" gap="xs" justify="end">
            {children}
          </Flex>
        </form>
      )}
    </Card>
  )
}
