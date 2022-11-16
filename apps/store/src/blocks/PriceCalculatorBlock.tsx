import { storyblokEditable } from '@storyblok/react'
import { PriceCalculator } from '@/components/ProductPage/PriceCalculator/PriceCalculator'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<unknown>

export const PriceCalculatorBlock = ({ blok }: Props) => {
  return <PriceCalculator {...storyblokEditable(blok)} />
}

PriceCalculatorBlock.blockName = 'priceCalculator'
