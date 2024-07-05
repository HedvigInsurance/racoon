'use client'
import { clsx } from 'clsx'
import { type ReactNode, useMemo } from 'react'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { useProductPageData } from '@/components/ProductPage/ProductPageDataProvider'
import { ProductHero } from '@/components/ProductPage/PurchaseForm/ProductHero/ProductHero'
import {
  purchaseFormHeroWrapper,
  purchaseFormResponsiveBlock,
  purchaseFormSection,
} from '@/components/ProductPage/PurchaseForm/PurchaseForm.css'

type ProductHeroContainerProps = {
  children: ReactNode
  size: 'small' | 'large'
  compact?: boolean
}
export const ProductHeroContainer = (props: ProductHeroContainerProps) => {
  const { product } = useProductPageData()
  const productData = useProductData()
  const pillow = useMemo(
    () => ({
      src: productData.pillowImage.src,
      alt: productData.pillowImage.alt ?? undefined,
    }),
    [productData],
  )
  return (
    <div
      className={clsx(
        purchaseFormResponsiveBlock,
        purchaseFormSection,
        purchaseFormHeroWrapper.base,
        props.compact ? purchaseFormHeroWrapper.compact : purchaseFormHeroWrapper.full,
      )}
    >
      <ProductHero
        name={product.name}
        description={product.description}
        pillow={pillow}
        size={props.size}
      />
      {props.children}
    </div>
  )
}
