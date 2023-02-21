import { ChangeEventHandler, useMemo } from 'react'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'

type Props = { className?: string }

export const ProductVariantSelector = ({ className }: Props) => {
  const { productData, selectedVariant, selectedVariantUpdate } = useProductPageContext()

  const variantOptions = useMemo(
    () =>
      productData.variants.map(({ displayName, typeOfContract }) => ({
        name: displayName,
        value: typeOfContract,
      })),
    [productData],
  )

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newSelectedVariant = productData.variants.find(
      (variant) => variant.typeOfContract === event.target.value,
    )

    if (newSelectedVariant) {
      selectedVariantUpdate(newSelectedVariant)
    }
  }

  const defaultValue = selectedVariant?.typeOfContract ?? productData.variants[0].typeOfContract

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
