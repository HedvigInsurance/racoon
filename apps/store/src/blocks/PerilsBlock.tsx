'use client'
import { storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { Badge, Space } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { Perils } from '@/components/Perils/Perils'
import {
  useProductData,
  useSelectedProductVariant,
} from '@/components/ProductData/ProductDataProvider'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'

type PerilsBlockProps = SbBaseBlockProps<{
  heading?: string
  hideDisabledPerils?: boolean
}>

export const PerilsBlock = ({ blok }: PerilsBlockProps) => {
  const { variants } = useProductData()
  const selectedProductVariant = useSelectedProductVariant()

  const allPerils = useMemo(() => {
    const perilsMap = new Map(
      variants.flatMap((item) => item.perils.map((peril) => [peril.title, peril])),
    )
    return Array.from(perilsMap.values())
  }, [variants])

  const items = useMemo(() => {
    const productVariant = selectedProductVariant ?? variants.at(0)
    if (!productVariant) return []
    return productVariant.perils.map((item) => ({ id: item.title, ...item }))
  }, [variants, selectedProductVariant])

  const missingItems = useMemo(() => {
    const addedPerils = new Set<string>(items.map((item) => item.id))
    return allPerils.filter((item) => !addedPerils.has(item.title))
  }, [allPerils, items])

  return (
    <GridLayout.Root {...storyblokEditable(blok)}>
      <GridLayout.Content width="1">
        <Space y={1}>
          {blok.heading && <Badge>{blok.heading}</Badge>}
          <Perils items={items} missingItems={blok.hideDisabledPerils ? [] : missingItems} />
        </Space>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
