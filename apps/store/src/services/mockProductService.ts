import { MarketLabel } from '@/lib/l10n/types'

export type Product = {
  market: MarketLabel
  name: string
}

const PRODUCTS: Product[] = [
  {
    name: 'SE_HOME',
    market: MarketLabel.SE,
  },
  {
    name: 'SE_CAR',
    market: MarketLabel.SE,
  },
]
