import { type ChangeEventHandler, useMemo } from 'react'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import {
  useProductData,
  useSelectedTypeOfContract,
} from '@/components/ProductData/ProductDataProvider'

type Props = { className?: string }

export const ProductVariantSelector = ({ className }: Props) => {
  const productData = useProductData()
  const [selectedTypeOfContract, setSelectedTypeOfContract] = useSelectedTypeOfContract()

  const variantOptions = useMemo(
    () =>
      productData.variants.map((item) => ({
        name: item.displayNameSubtype || item.displayName,
        value: item.typeOfContract,
      })),
    [productData],
  )

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setSelectedTypeOfContract(event.target.value)
  }

  const defaultValue = selectedTypeOfContract ?? productData.variants[0].typeOfContract

  return (
    <InputSelect
      className={className}
      name="product-variant-select"
      options={variantOptions}
      onChange={handleChange}
      defaultValue={defaultValue}
      size="small"
    />
  )
}
