import styled from '@emotion/styled'
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import { useBreakpoint } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { DesktopLayout } from './DesktopLayout'
import { MobileLayout } from './MobileLayout'

export type ProductPageBlockProps = SbBaseBlockProps<{
  overviewLabel: string
  coverageLabel: string
  overview: SbBlokData[]
  coverage: SbBlokData[]
  body: SbBlokData[]
}>

export const ProductPageBlock = ({ blok }: ProductPageBlockProps) => {
  const isLarge = useBreakpoint('lg')

  return (
    <Main {...storyblokEditable(blok)}>
      {isLarge && <DesktopLayout blok={blok} />}
      {!isLarge && <MobileLayout blok={blok} />}
      {blok.body.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </Main>
  )
}
ProductPageBlock.blockName = 'product'

const Main = styled.main({ width: '100%' })
