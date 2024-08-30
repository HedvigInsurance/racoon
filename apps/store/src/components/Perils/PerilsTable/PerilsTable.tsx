'use client'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { PerilsTabs } from './PerilsTabs'

export function PerilsTable() {
  const variant = useResponsiveVariant('lg')
  const { variants } = useProductData()
  return <div>{variant === 'mobile' && <PerilsTabs variants={variants} />}</div>
}
