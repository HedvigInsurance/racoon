import { ProductDataQuery } from '@/services/apollo/generated'

export type ProductData = NonNullable<ProductDataQuery['product']>
