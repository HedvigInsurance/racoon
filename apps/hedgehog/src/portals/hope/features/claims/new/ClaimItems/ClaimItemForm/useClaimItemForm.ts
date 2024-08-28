import { SubmitHandler, useForm } from 'react-hook-form'

import gql from 'graphql-tag'

import { getBrandsFromTypes } from '@hope/features/tools/item-models/useItemModels'

import { omit } from '@hedvig-ui/utils/object-utils'

import {
  ClaimItem,
  ItemModel,
  ItemModelType,
  UpsertClaimItemInput,
  useGetItemModelTypesQuery,
  useGetItemModelsQuery,
  useGetItemProblemsQuery,
} from 'types/generated/graphql'

gql`
  query GetItemProblems {
    itemProblems {
      name
      parent
    }
  }
`

type Params = {
  onSubmit: (itemDetails: UpsertClaimItemInput) => void
  item?: ClaimItem
}

interface FormValues extends Omit<UpsertClaimItemInput, 'purchasePrice'> {
  purchasePriceAmount?: number | string
  purchasePriceCurrency?: string
}

const fromItemToFormValues = (item: ClaimItem) => {
  const editableKeys: (keyof UpsertClaimItemInput)[] = [
    'brand',
    'customName',
    'modelId',
    'problems',
    'purchaseDate',
    'type',
  ]

  const itemWithEditableKeys = editableKeys.reduce<FormValues>(
    (result, key) => {
      const keyValue = item[key]

      if (keyValue) {
        return {
          ...result,
          [key]: keyValue,
        }
      }

      return result
    },
    { problems: [] },
  )

  itemWithEditableKeys.purchasePriceAmount = item.purchasePrice?.amount
  itemWithEditableKeys.purchasePriceCurrency = item.purchasePrice?.currency

  return itemWithEditableKeys
}

const getBrandsForSelectedType = (
  itemModelTypes?: ItemModelType[],
  selectedTypeName?: string | null,
) => {
  const selectedType = itemModelTypes?.find(
    (modelType) => modelType.name === selectedTypeName,
  )
  return getBrandsFromTypes(
    selectedType ? [selectedType] : (itemModelTypes ?? []),
  )
}

type GetAvailableModelsParams = {
  allItemModels?: ItemModel[]
  selectedTypeName?: string | null
  selectedBrand?: string | null
}

const getAvailableModels = ({
  allItemModels = [],
  selectedTypeName,
  selectedBrand,
}: GetAvailableModelsParams) => {
  return allItemModels.filter((model) => {
    const isMatchingType =
      selectedTypeName === undefined || model.type === selectedTypeName

    const isMatchingBrand =
      selectedBrand === undefined || model.brand === selectedBrand

    return isMatchingType && isMatchingBrand
  })
}

const emptyFormValues: FormValues = {
  purchasePriceAmount: '',
  problems: [],
}

export const useClaimItemForm = ({ onSubmit, item }: Params) => {
  const { data: { itemModelTypes = [] } = {}, loading: isItemTypeLoading } =
    useGetItemModelTypesQuery()

  const {
    data: { itemModels: allItemModels = [] } = {},
    loading: isItemModelLoading,
  } = useGetItemModelsQuery()

  const { data: { itemProblems = [] } = {}, loading: isProblemsLoading } =
    useGetItemProblemsQuery()

  const isLoading = isItemTypeLoading || isItemModelLoading || isProblemsLoading

  const { register, handleSubmit, watch, resetField, control } =
    useForm<FormValues>({
      defaultValues: item ? fromItemToFormValues(item) : emptyFormValues,
    })

  const submitHandler: SubmitHandler<FormValues> = (fields) => {
    const submitValues: UpsertClaimItemInput = omit(fields, [
      'purchasePriceAmount',
      'purchasePriceCurrency',
    ])

    const { purchasePriceAmount, purchasePriceCurrency } = fields

    const hasPurchasePrice = purchasePriceAmount || purchasePriceAmount === 0

    if (hasPurchasePrice && purchasePriceCurrency) {
      submitValues.purchasePrice = {
        amount: Number(purchasePriceAmount),
        currency: purchasePriceCurrency,
      }
    }

    if (submitValues.modelId) {
      submitValues.type = null
      submitValues.brand = null
      submitValues.customName = null
    }

    onSubmit(submitValues)
  }

  const selectedTypeName = watch('type')
  const selectedBrand = watch('brand')

  const itemBrands = getBrandsForSelectedType(itemModelTypes, selectedTypeName)
  const itemModels = getAvailableModels({
    allItemModels,
    selectedTypeName,
    selectedBrand,
  })

  return {
    itemTypes: itemModelTypes,
    itemBrands,
    itemModels,
    itemProblems,
    control,
    isLoading,
    submitHandler,
    register,
    resetField,
    watch,
    handleSubmit: handleSubmit(submitHandler),
  }
}
