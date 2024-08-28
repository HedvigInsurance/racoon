import {
  ClaimItem,
  UpsertClaimItemInput,
  useGetItemModelsQuery,
  useGetItemModelTypesQuery,
  useGetItemProblemsQuery,
} from 'types/generated/graphql'
import { getBrandsFromTypes } from '@hope/features/tools/item-models/useItemModels'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gql from 'graphql-tag'
import { useClaim } from '../../hooks/use-claim'

gql`
  query GetItemProblems {
    itemProblems {
      name
      parent
    }
  }
`

const ignoreKeys = ['__typename', 'id', 'note', 'modelName', 'valuation']

function fromItemToUpsertItemInput(item: ClaimItem) {
  const returnItem = { ...item }
  ignoreKeys.forEach((key) => delete returnItem[key as keyof ClaimItem])
  return returnItem as UpsertClaimItemInput
}

const emptyFormValues = {
  type: undefined,
  brand: undefined,
  modelId: undefined,
  customName: undefined,
  problems: [],
}

export const useAddOrEditItemForm = ({
  initialValues,
  formType,
}: {
  initialValues?: ClaimItem
  formType: 'add' | 'edit'
}) => {
  const { data: { itemModelTypes } = {} } = useGetItemModelTypesQuery()
  const { data: { itemModels } = {} } = useGetItemModelsQuery()
  const { data: { itemProblems } = {} } = useGetItemProblemsQuery()
  const { preferredCurrency } = useClaim()

  const [formValues, setFormValues] = useState<UpsertClaimItemInput>(
    initialValues ?? emptyFormValues,
  )
  useEffect(() => {
    if (formType === 'add') {
      setFormValues(emptyFormValues)
    }
    if (formType === 'edit') {
      setFormValues(
        initialValues
          ? fromItemToUpsertItemInput(initialValues)
          : emptyFormValues,
      )
    }
  }, [formType, initialValues, itemModels])
  const customNameRef = useRef<HTMLInputElement>(null)

  const selectedType = useMemo(
    () => itemModelTypes?.find((type) => type.name === formValues.type),
    [itemModelTypes, formValues.type],
  )

  const itemModelBrands = useMemo(() => {
    return getBrandsFromTypes(
      selectedType ? [selectedType] : (itemModelTypes ?? []),
    )
  }, [selectedType, itemModelTypes])

  const availableModels = useMemo(
    () =>
      itemModels?.filter((model) => {
        const selectedType = formValues?.type
        const selectedBrand = formValues?.brand

        if (selectedType && selectedBrand) {
          return model.type === selectedType && model.brand === selectedBrand
        }
        if (selectedType) {
          return model.type === selectedType
        }
        if (selectedBrand) {
          return model.brand === selectedBrand
        }
        return true
      }),
    [formValues?.brand, formValues?.type, itemModels],
  )

  const handleFormChange = useCallback(
    (value: string, field: keyof UpsertClaimItemInput) => {
      if (formValues[field] === value) return

      const newFormValues = { ...formValues }

      switch (field) {
        case 'purchasePrice':
          newFormValues[field] = {
            amount: parseFloat(value),
            currency: preferredCurrency!,
          }
          break
        case 'problems':
          if (formValues.problems.includes(value)) {
            newFormValues.problems = formValues.problems.filter(
              (problem) => problem != value,
            )
            break
          }
          newFormValues.problems = [...formValues.problems, value]
          break
        default:
          newFormValues[field] = value
          break
      }

      if (field === 'type' || field === 'brand') {
        newFormValues.modelId = undefined
      }
      if (
        !itemModelBrands.find((brand) => brand.name === newFormValues.brand)
      ) {
        newFormValues.brand = undefined
      }
      setFormValues(newFormValues)
    },
    [formValues, itemModelBrands, preferredCurrency],
  )

  const clearProblems = () => {
    setFormValues((prev) => ({ ...prev, problems: [] }))
  }

  useEffect(() => {
    if (!formValues.brand) {
      return
    }
    if (!itemModelBrands.find((brand) => brand.name === formValues.brand)) {
      handleFormChange('', 'brand')
    }
  }, [itemModelBrands, formValues.brand, handleFormChange])

  useEffect(() => {
    const model = itemModels?.find((model) => model.id === formValues.modelId)
    if (!model) {
      return customNameRef?.current?.focus()
    }

    setFormValues((prev) => ({ ...prev, type: model.type, brand: model.brand }))
  }, [formValues.modelId, itemModels])

  return {
    formValues,
    handleFormChange,
    preferredCurrency,
    itemModels: availableModels,
    itemModelTypes,
    itemModelBrands,
    itemProblems,
    customNameRef,
    clearProblems,
  }
}
