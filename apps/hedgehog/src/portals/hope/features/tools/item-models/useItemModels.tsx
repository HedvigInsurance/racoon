import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import gql from 'graphql-tag'
import {
  ItemModel,
  useCreateItemModelMutation,
  useGetItemModelsLazyQuery,
  useGetItemModelTypesQuery,
  useRemoveItemModelMutation,
  useUpdateItemModelMutation,
} from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import {
  convertEnumToTitle,
  extractErrorMessage,
  stringSortByNumberOrText,
} from '@hedvig-ui'

gql`
  query GetItemModels($type: String, $brand: String) {
    itemModels(type: $type, brand: $brand) {
      ...ItemModel
    }
  }

  mutation CreateItemModel($input: CreateItemModelInput!) {
    itemModel_create(input: $input) {
      ...ItemModel
    }
  }

  mutation UpdateItemModel($id: ID!, $input: UpdateItemModelInput!) {
    itemModel_update(itemModelId: $id, input: $input) {
      ...ItemModel
    }
  }

  mutation RemoveItemModel($id: ID!) {
    itemModel_remove(itemModelId: $id) {
      ...ItemModel
    }
  }

  query GetItemModelTypes {
    itemModelTypes {
      name
      displayName
      brands {
        name
        displayName
      }
    }
  }
`

export type ItemModelBrand = {
  name: string
  displayName: string
}

export type ItemModelType = {
  name: string
  displayName: string
  brands: ItemModelBrand[]
}

export const getBrandsFromTypes = (types: ItemModelType[]) =>
  types.reduce((brands, type) => {
    type.brands.forEach((brand) => {
      if (!brands.find((b) => b.name === brand.name)) {
        brands.push(brand)
      }
    })
    return brands
  }, [] as ItemModelBrand[])

const useItemModelData = () => {
  const [fetchItemModels, { data, refetch, loading: loadingItemModels }] =
    useGetItemModelsLazyQuery()
  const { data: { itemModelTypes } = {}, loading: loadingItemModelTypes } =
    useGetItemModelTypesQuery()
  const [createItemModel] = useCreateItemModelMutation()
  const [updateItemModel] = useUpdateItemModelMutation()
  const [removeItemModel] = useRemoveItemModelMutation()
  const [selectedTypes, setSelectedTypes] = useState<ItemModelType[]>([])
  const [selectedBrands, setSelectedBrands] = useState<ItemModelBrand[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const itemModelBrands = useMemo(() => {
    if (!itemModelTypes?.length) {
      return []
    }
    return getBrandsFromTypes(itemModelTypes)
  }, [itemModelTypes])

  const itemModels = useMemo(() => {
    if (!data?.itemModels.length) {
      return [] as ItemModel[]
    }
    return data.itemModels
  }, [data?.itemModels])

  useEffect(() => {
    fetchItemModels().catch(null)
  }, [fetchItemModels])

  const filteredModels = useMemo(() => {
    const tmpModels = searchTerm
      ? itemModels.filter(
          (model) =>
            model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            convertEnumToTitle(model.type)
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            convertEnumToTitle(model.brand)
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            `${convertEnumToTitle(
              model.brand,
            ).toLowerCase()} ${model.name.toLowerCase()}`.includes(
              searchTerm.toLowerCase(),
            ),
        )
      : itemModels

    if (!selectedTypes.length && !selectedBrands.length) {
      return tmpModels
    }

    if (!selectedBrands.length) {
      return tmpModels.filter(
        (model) => !!selectedTypes.find((type) => type.name === model.type),
      )
    }

    if (!selectedTypes.length) {
      return tmpModels.filter(
        (model) => !!selectedBrands.find((brand) => brand.name === model.brand),
      )
    }

    return tmpModels.filter(
      (model) =>
        !!selectedTypes.find((type) => type.name === model.type) &&
        !!selectedBrands.find((brand) => brand.name === model.brand),
    )
  }, [itemModels, selectedTypes, selectedBrands, searchTerm])

  const sortedModels = useMemo(
    () =>
      [...filteredModels].sort((a, b) => {
        if (a.type === b.type) {
          if (a.brand === b.brand) {
            return stringSortByNumberOrText(a.name, b.name)
          }
          return b.brand < a.brand ? 1 : -1
        }
        return b.type < a.type ? 1 : -1
      }),
    [filteredModels],
  )

  const toggleTypeInFilter = useCallback((typeToToggle: ItemModelType) => {
    setSelectedTypes((prevSelectedTypes) => {
      if (prevSelectedTypes.includes(typeToToggle)) {
        return prevSelectedTypes.filter(
          (type) => typeToToggle.name != type.name,
        )
      }
      return [...prevSelectedTypes, typeToToggle]
    })
  }, [])

  const toggleBrandInFilter = useCallback((brandToToggle: ItemModelBrand) => {
    setSelectedBrands((prevSelectedBrands) => {
      if (
        prevSelectedBrands.find((brand) => brand.name === brandToToggle.name)
      ) {
        return prevSelectedBrands.filter(
          (brand) => brandToToggle.name != brand.name,
        )
      }
      return [...prevSelectedBrands, brandToToggle]
    })
  }, [])

  const selectableBrands = useMemo(() => {
    if (!selectedTypes.length) {
      return itemModelBrands
    }
    return getBrandsFromTypes(selectedTypes)
  }, [selectedTypes, itemModelBrands])

  useEffect(() => {
    setSelectedBrands((prevSelectedBrands) =>
      prevSelectedBrands.filter(
        (brand) => !!selectableBrands.find((b) => b.name === brand.name),
      ),
    )
  }, [selectableBrands])

  const canAdd = useCallback(
    (newModel: Partial<ItemModel>) =>
      !!newModel.name &&
      newModel.name.trim() != '' &&
      !itemModels.find(
        (model) => model.name.toLowerCase() == newModel.name?.toLowerCase(),
      ) &&
      !!selectableBrands.find((brand) => brand.name === newModel.brand),
    [itemModels, selectableBrands],
  )

  const firstTypeWithAvailableBrand = useMemo(
    () =>
      selectedTypes.find(
        (type) =>
          !!type.brands.find(
            (brand) => !!selectableBrands.find((b) => b.name === brand.name),
          ),
      ),
    [selectedTypes, selectableBrands],
  )

  const typeForAddingModel = useMemo(() => {
    const searchTypes = itemModelTypes?.length
      ? [...selectedTypes, ...itemModelTypes]
      : [...selectedTypes]
    return (
      searchTypes.find(
        (type) =>
          !!type.brands.find(
            (brand) => brand.name === selectedBrands?.[0]?.name,
          ),
      ) ?? firstTypeWithAvailableBrand
    )
  }, [
    selectedTypes,
    firstTypeWithAvailableBrand,
    itemModelTypes,
    selectedBrands,
  ])

  const brandForAddingModel = useMemo(
    () => selectedBrands?.[0] ?? typeForAddingModel?.brands[0],
    [selectedBrands, typeForAddingModel?.brands],
  )

  const addModel = useCallback(
    async (newModel: Partial<ItemModel>) => {
      if (!newModel.name) {
        return toast.error('Model name is required')
      }
      const type = newModel.type ?? ''
      const brand = newModel.brand ?? ''

      await toast.promise(
        createItemModel({
          variables: {
            input: {
              type,
              brand,
              name: newModel.name as string,
            },
          },
        }),
        {
          loading: `Adding ${newModel.name}`,
          success: () => {
            refetch()
            return `${newModel.name} added`
          },
          error: ({ message }) => `${extractErrorMessage(message)}`,
        },
      )
    },
    [createItemModel, refetch],
  )

  const updateModel = useCallback(
    async (id: string, newValues: Partial<ItemModel>) => {
      await toast.promise(
        updateItemModel({
          variables: {
            id,
            input: {
              ...newValues,
            },
          },
        }),
        {
          loading: 'Updating',
          success: () => {
            refetch()
            return 'Item updated'
          },
          error: ({ message }) => extractErrorMessage(message),
        },
      )
    },
    [updateItemModel, refetch],
  )

  const removeModel = useCallback(
    async (id: string) => {
      await toast.promise(
        removeItemModel({
          variables: {
            id,
          },
        }),
        {
          loading: 'Removing',
          success: () => {
            refetch()
            return 'Item removed'
          },
          error: ({ message }) => extractErrorMessage(message),
        },
      )
    },
    [removeItemModel, refetch],
  )

  return {
    itemModels: sortedModels,
    itemModelTypes: itemModelTypes ?? [],
    itemModelBrands,
    refetchModels: refetch,
    toggleTypeInFilter,
    toggleBrandInFilter,
    selectedTypes,
    selectableBrands,
    selectedBrands,
    searchTerm,
    setSearchTerm,
    addModel,
    canAdd,
    updateModel,
    removeModel,
    typeForAddingModel,
    brandForAddingModel,
    loadingItemModels,
    loadingItemModelTypes,
  }
}

type UseItemModelDataReturnType = ReturnType<typeof useItemModelData>

const ItemModelContext = createContext<UseItemModelDataReturnType>({
  itemModels: [],
  itemModelTypes: [],
  itemModelBrands: [],
  refetchModels: () => new Promise(() => null),
  toggleTypeInFilter: () => null,
  toggleBrandInFilter: () => null,
  selectedTypes: [],
  selectableBrands: [],
  selectedBrands: [],
  searchTerm: '',
  setSearchTerm: () => null,
  addModel: () => new Promise(() => null),
  canAdd: () => false,
  updateModel: () => new Promise(() => null),
  removeModel: () => new Promise(() => null),
  typeForAddingModel: {} as ItemModelType,
  brandForAddingModel: {} as ItemModelBrand,
  loadingItemModels: false,
  loadingItemModelTypes: false,
})

export const ItemModelProvider = ({ children }: { children: ReactNode }) => {
  const itemModelData = useItemModelData()

  return (
    <ItemModelContext.Provider value={itemModelData}>
      {children}
    </ItemModelContext.Provider>
  )
}

export const useItemModels = () => useContext(ItemModelContext)
