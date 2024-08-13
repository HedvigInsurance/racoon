import { type ChangeEventHandler, useMemo } from 'react'
import { InputSelect, type InputSelectProps } from '@/components/InputSelect/InputSelect'
import {
  useProductData,
  useSelectedTypeOfContract,
} from '@/components/ProductData/ProductDataProvider'

type Props = Pick<InputSelectProps, 'className' | 'backgroundColor'>

export const ProductVariantSelector = ({ className, backgroundColor }: Props) => {
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
      backgroundColor={backgroundColor}
      size="small"
    />
  )
}
