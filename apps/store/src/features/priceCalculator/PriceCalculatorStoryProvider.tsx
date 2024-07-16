'use client'
import { useHydrateAtoms } from 'jotai/utils'
import { type ReactNode } from 'react'
import { priceCalculatorDeductibleInfoAtom } from '@/features/priceCalculator/priceCalculatorAtoms'
import type { PriceCalculatorPageStory } from '@/services/storyblok/storyblok'

type Props = {
  story: PriceCalculatorPageStory
  children: ReactNode
}
export function PriceCalculatorStoryProvider({ story, children }: Props) {
  useHydrateAtoms([[priceCalculatorDeductibleInfoAtom, story.content.deductibleInfo ?? null]], {
    dangerouslyForceHydrate: true,
  })
  return children
}
