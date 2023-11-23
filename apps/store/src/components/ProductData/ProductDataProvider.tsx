import { Provider, atom, createStore, useAtom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { ReactNode, useMemo } from 'react'
import { ProductData } from './ProductData.types'

const PRODUCT_DATA_ATOM = atom<ProductData | null>(null)
const SELECTED_TYPE_OF_CONTRACT_ATOM = atom<string | undefined>(undefined)

const SELECTED_PRODUCT_VARIANT_ATOM = atom((get) => {
  const productData = get(PRODUCT_DATA_ATOM)
  const typeOfContract = get(SELECTED_TYPE_OF_CONTRACT_ATOM)
  return productData?.variants.find((item) => item.typeOfContract === typeOfContract)
})

type Props = {
  children: ReactNode
  productData: ProductData
  selectedTypeOfContract?: string
}

export const ProductDataProvider = (props: Props) => {
  const store = useMemo(createStore, [props.productData.id])

  return (
    <Provider store={store}>
      <HydrateData
        store={store}
        productData={props.productData}
        selectedTypeOfContract={props.selectedTypeOfContract}
      />
      {props.children}
    </Provider>
  )
}

type HydrateDataProps = Pick<Props, 'productData' | 'selectedTypeOfContract'> & {
  store: ReturnType<typeof createStore>
}

const HydrateData = (props: HydrateDataProps) => {
  useHydrateAtoms(
    [
      [PRODUCT_DATA_ATOM, props.productData],
      [SELECTED_TYPE_OF_CONTRACT_ATOM, props.selectedTypeOfContract],
    ],
    { store: props.store },
  )
  return null
}

export const useProductData = () => {
  const value = useAtomValue(PRODUCT_DATA_ATOM)
  if (value === null) throw new Error('ProductData accessed without hydrating')
  return value
}

export const useSelectedTypeOfContract = () => {
  return useAtom(SELECTED_TYPE_OF_CONTRACT_ATOM)
}

export const useSelectedProductVariant = () => {
  return useAtomValue(SELECTED_PRODUCT_VARIANT_ATOM)
}
