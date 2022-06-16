import Head from 'next/head'
import { PriceCalculator } from '@/components/PriceCalculator/PriceCalculator'
import { ProductPageProps } from './ProductPage.types'

export const ProductPage = ({ product }: ProductPageProps) => {
  return (
    <div>
      <Head>
        <title>{product.pageTitle}</title>
      </Head>
      <h1>Product Page for {product.name}</h1>

      <PriceCalculator />
    </div>
  )
}
