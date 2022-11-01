import { storyblokEditable } from '@storyblok/react'
import { PriceCalculator } from '@/components/ProductPage/PriceCalculator/PriceCalculator'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{ title: string }>

export const PriceCalculatorBlock = ({ blok }: Props) => {
  return <PriceCalculator title={blok.title} {...storyblokEditable(blok)} />
}

PriceCalculatorBlock.blockName = 'priceCalculator'
