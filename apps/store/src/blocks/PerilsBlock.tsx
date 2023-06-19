import { storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { Badge, Space } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { Perils } from '@/components/Perils/Perils'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type PerilsBlockProps = SbBaseBlockProps<{
  heading?: string
  hideDisabledPerils?: boolean
}>

export const PerilsBlock = ({ blok }: PerilsBlockProps) => {
  const { productData, selectedVariant } = useProductPageContext()

  const allPerils = useMemo(() => {
    const perilsMap = new Map(
      productData.variants.flatMap((item) => item.perils.map((peril) => [peril.title, peril])),
    )
    return Array.from(perilsMap.values())
  }, [productData.variants])

  const items = useMemo(() => {
    const selectedProductVariant = productData.variants.find(
      (item) => item.typeOfContract === selectedVariant?.typeOfContract,
    )

    const productVariant = selectedProductVariant ?? productData.variants[0]

    return productVariant.perils.map((item) => ({
      id: item.title,
      ...item,
    }))
  }, [productData, selectedVariant])

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

PerilsBlock.blockName = 'perils'
