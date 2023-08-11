import { type ComponentProps } from 'react'
import { CartCost, CartCampaign, CartEntry } from '@/components/CartInventory/CartInventory.types'
import { ProductItem } from '@/components/ProductItem/ProductItem'

type ProductItemProps = Omit<ComponentProps<typeof ProductItem>, 'children' | 'defaultExpanded'> & {
  id: string
}

export type CartPageProps = {
  shopSessionId?: string
  campaignsEnabled?: boolean
  campaign?: CartCampaign
  cost?: CartCost
  entries?: Array<CartEntry>
  productItems?: Array<ProductItemProps>
}
