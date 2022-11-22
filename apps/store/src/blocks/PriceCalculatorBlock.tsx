import { storyblokEditable } from '@storyblok/react'
import { PurchaseForm } from '@/components/ProductPage/PurchaseForm/PurchaseForm'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<unknown>

export const PriceCalculatorBlock = ({ blok }: Props) => {
  return <PurchaseForm {...storyblokEditable(blok)} />
}

PriceCalculatorBlock.blockName = 'priceCalculator'
