import { Global } from '@emotion/react'
import styled from '@emotion/styled'
import { storyblokEditable, StoryblokComponent, SbBlokData } from '@storyblok/react'
import { mq, useBreakpoint } from 'ui'
import { MENU_BAR_HEIGHT_DESKTOP } from '@/components/Header/HeaderStyles'
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
    <>
      <Global
        styles={{
          html: {
            [mq.md]: {
              scrollPaddingTop: MENU_BAR_HEIGHT_DESKTOP,
            },
          },
        }}
      />
      <Main {...storyblokEditable(blok)}>
        {isLarge && <DesktopLayout blok={blok} />}
        {!isLarge && <MobileLayout blok={blok} />}
        {blok.body.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
      </Main>
    </>
  )
}
ProductPageBlock.blockName = 'product'

const Main = styled.main({ width: '100%' })
