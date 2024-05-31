'use client'

import styled from '@emotion/styled'
import { StoryblokComponent, storyblokEditable, type SbBlokData } from '@storyblok/react'
import { Space } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { ProductItemSkeleton } from '@/components/ProductItem/ProductItem'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  checkoutPageContent: Array<SbBlokData>
}>

export const WidgetFlowBlock = ({ blok }: Props) => {
  return (
    <GridLayout.Root {...storyblokEditable(blok)}>
      <GridLayout.Content width="1/3" align="center">
        <CheckoutContentPlaceholder />
      </GridLayout.Content>

      <GridLayout.Content width="1" align="center">
        {blok.checkoutPageContent.map((nestedBlock) => (
          <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

const RecommendationSkeleton = styled(Skeleton)({
  height: '16rem',
})

const SignButtonSkeleton = styled(Skeleton)({
  height: '3.5rem',
})

const StepSkeleton = styled(Skeleton)({
  flex: 1,
  height: '2.125rem',
})

const BreadCrumbSkeleton = () => {
  return (
    <SpaceFlex direction="horizontal" space={1}>
      <StepSkeleton />
      <StepSkeleton />
      <StepSkeleton />
    </SpaceFlex>
  )
}

const HeadingSkeleton = styled(Skeleton)({
  height: '5.625rem',
})

const CheckoutContentPlaceholder = () => {
  return (
    <Space style={{ marginTop: '1rem' }} y={4}>
      <BreadCrumbSkeleton />

      <HeadingSkeleton />

      <Space y={1}>
        <Space y={2}>
          <ProductItemSkeleton />
          <RecommendationSkeleton />
        </Space>
        <SignButtonSkeleton />
      </Space>
    </Space>
  )
}
