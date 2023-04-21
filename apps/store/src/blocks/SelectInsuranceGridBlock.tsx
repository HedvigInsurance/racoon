import { storyblokEditable } from '@storyblok/react'
import { Heading, Space } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { useProductMetadata } from '@/components/LayoutWithMenu/ProductMetadataContext'
import { ProductItem } from '@/components/SelectInsuranceGrid/ProductItem'
import { SelectInsuranceGrid } from '@/components/SelectInsuranceGrid/SelectInsuranceGrid'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  title?: string
}>

export const SelectInsuranceGridBlock = ({ blok }: Props) => {
  const products = useProductMetadata()

  return (
    <GridLayout.Root>
      <GridLayout.Content width="1" align="center">
        <Space y={4}>
          {blok.title && (
            <Heading as="h2" variant={{ _: 'serif.32', lg: 'serif.48' }} align="center">
              {blok.title}
            </Heading>
          )}

          <SelectInsuranceGrid {...storyblokEditable(blok)}>
            {products?.map((item) => (
              <ProductItem.Root key={item.id} href={item.pageLink}>
                <ProductItem.Pillow {...item.pillowImage} />
                <ProductItem.Content>
                  <ProductItem.Title>{item.displayNameShort}</ProductItem.Title>
                  <ProductItem.Tagline>{item.tagline}</ProductItem.Tagline>
                </ProductItem.Content>
              </ProductItem.Root>
            ))}
          </SelectInsuranceGrid>
        </Space>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
SelectInsuranceGridBlock.blockName = 'selectInsuranceGrid'
