import styled from '@emotion/styled'
import Head from 'next/head'
import { ReactElement } from 'react'
import { mq, theme } from 'ui'
import { HeaderBlock } from '@/blocks/HeaderBlock'
import {
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
  GlobalProductMetadata,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { GlobalStory, PageStory } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { Menu } from './Menu'

type Props = {
  children: ReactElement<{
    className: string
    [GLOBAL_PRODUCT_METADATA_PROP_NAME]: GlobalProductMetadata
    story: PageStory | undefined
    globalStory: GlobalStory | undefined
  }>
}

export const MemberAreaLayout = ({ children }: Props) => {
  const { className, globalStory } = children.props

  // Happens for transitions from pages with layout to pages without layout
  if (!globalStory) return null

  const headerBlock = filterByBlockType(globalStory.content.header, HeaderBlock.blockName)
  return (
    <>
      <Head>
        <title>Member page</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <Wrapper className={className}>
        {headerBlock.map((nestedBlock) => (
          <HeaderBlock key={nestedBlock._uid} blok={nestedBlock} />
        ))}
        <Main>
          <Menu />
          <Content>{children}</Content>
        </Main>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div({
  minHeight: '100vh',
  isolation: 'isolate',
})

const Main = styled.main({
  display: 'grid',
  gridTemplateRows: '60px 1fr',
  width: '100%',
  marginInline: 'auto',
  paddingBottom: theme.space.xxl,

  [mq.lg]: {
    paddingTop: `5rem`,
    gridTemplateColumns: '18rem 1fr 18rem',
    gridTemplateRows: 'auto',
  },
})

const Content = styled.div({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginInline: 'auto',
  paddingInline: theme.space.md,
})
