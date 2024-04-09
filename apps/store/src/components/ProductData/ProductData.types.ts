import type { ProductDataQuery } from '@/services/graphql/generated'

export type ProductData = NonNullable<ProductDataQuery['product']>
