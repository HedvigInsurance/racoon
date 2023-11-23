import { Provider, atom, createStore, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { ReactNode, useMemo } from 'react'
import { ProductData } from './ProductData.types'

const PRODUCT_DATA_ATOM = atom<ProductData | null>(null)

type Props = {
  children: ReactNode
  productData: ProductData
}

export const ProductDataProvider = (props: Props) => {
  const store = useMemo(createStore, [props.productData.id])

  return (
    <Provider store={store}>
      <HydrateProductData store={store} productData={props.productData} />
      {props.children}
    </Provider>
  )
}

type HydrateProductDataProps = {
  productData: ProductData
  store: ReturnType<typeof createStore>
}

const HydrateProductData = (props: HydrateProductDataProps) => {
  useHydrateAtoms([[PRODUCT_DATA_ATOM, props.productData]], { store: props.store })
  return null
}

export const useProductData = () => {
  const value = useAtomValue(PRODUCT_DATA_ATOM)
  if (value === null) throw new Error('ProductData accessed without hydrating')
  return value
}
