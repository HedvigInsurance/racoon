import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { Heading, Space, mq } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { useProductMetadata } from '@/components/LayoutWithMenu/ProductMetadataContext'
import { ProductItem } from '@/components/SelectInsuranceGrid/ProductItem'
import { SelectInsuranceGrid } from '@/components/SelectInsuranceGrid/SelectInsuranceGrid'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  title?: string
}>

export const SelectInsuranceGridBlock = ({ blok, nested }: Props) => {
  const products = useProductMetadata()

  return (
    <Root data-nested={nested}>
      <GridLayout.Content width="1" align="center">
        <Space y={{ base: 2, md: 4 }}>
          {blok.title && (
            <Heading as="h2" variant={{ _: 'serif.32', lg: 'serif.48' }} align="center">
              {blok.title}
            </Heading>
          )}

          <SelectInsuranceGrid {...storyblokEditable(blok)}>
            {products?.map((item) => (
              <ProductItem.Root key={item.id}>
                <ProductItem.Pillow {...item.pillowImage} />
                <ProductItem.Content>
                  <ProductItem.TitleLink href={item.pageLink} title={item.displayNameFull}>
                    {item.displayNameShort}
                  </ProductItem.TitleLink>
                  <ProductItem.Tagline>{item.tagline}</ProductItem.Tagline>
                </ProductItem.Content>
              </ProductItem.Root>
            ))}
          </SelectInsuranceGrid>
        </Space>
      </GridLayout.Content>
    </Root>
  )
}

const Root = styled(GridLayout.Root)({
  // When using the component in a Modal we need to center align it in larger viewports

  '&[data-nested=true]': {
    [mq.lg]: {
      paddingTop: '16vh',
    },

    [mq.xxl]: {
      paddingTop: '20vh',
    },
  },
})

SelectInsuranceGridBlock.blockName = 'selectInsuranceGrid'
