import dynamic from 'next/dynamic'

export const PriceCalculatorDynamic = dynamic(() =>
  import('./PriceCalculator').then((mod) => mod.PriceCalculator),
)
