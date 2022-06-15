import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { NextProductPageProps } from '@/pages/products/[product]'

export const ProductPage = ({ product }: NextProductPageProps) => {
  return (
    <div>
      <h1>Product Page for {product.name}</h1>

      <PriceCalculator />
    </div>
  )
}
