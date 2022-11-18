import styled from '@emotion/styled'
import { SbBlokData, storyblokEditable } from '@storyblok/react'
import Image from 'next/image'
import { useMemo } from 'react'
import { Perils } from '@/components/Perils/Perils'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'

export const PerilsBlock = (blok: SbBlokData) => {
  const { productData, selectedVariant } = useProductPageContext()

  const items = useMemo(() => {
    const selectedProductVariant = productData.variants.find(
      (item) => item.typeOfContract === selectedVariant?.typeOfContract,
    )

    const productVariant = selectedProductVariant ?? productData.variants[0]

    return productVariant.perils.map((item) => ({
      id: item.title,
      name: item.title,
      description: item.description,
      covered: item.covered,
      notCovered: item.exceptions,
      icon: <Image src={item.icon.variants.light.svgUrl} alt="" width={24} height={24} />,
    }))
  }, [productData, selectedVariant])

  return (
    <Wrapper {...storyblokEditable(blok)}>
      <Perils items={items} />
    </Wrapper>
  )
}

PerilsBlock.blockName = 'perils'

const Wrapper = styled.div(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
}))
