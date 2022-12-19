import styled from '@emotion/styled'
import { ReactElement } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/HeaderBlock'
import { useTrackShopSession } from '@/services/shopSession/useTrackShopSession'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

const Wrapper = styled.div({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  isolation: 'isolate',
})

type LayoutWithMenuProps = {
  children: ReactElement<StoryblokPageProps & { className: string }>
}

export const LayoutWithMenu = ({ children }: LayoutWithMenuProps) => {
  const { story, globalStory, className } = children.props
  const headerBlock = filterByBlockType(globalStory?.content.header, HeaderBlock.blockName)
  const footerBlock = filterByBlockType(globalStory?.content.footer, FooterBlock.blockName)

  // TODO: Extract some common layout component and move there if we ever have multiple layouts
  useTrackShopSession()

  return (
    <Wrapper className={className}>
      {(!story || !story.content.hideMenu) &&
        headerBlock?.map((nestedBlock) => (
          <HeaderBlock key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      {children}
      {(!story || !story.content.hideMenu) &&
        footerBlock?.map((nestedBlock) => (
          <FooterBlock key={nestedBlock._uid} blok={nestedBlock as any} />
        ))}
    </Wrapper>
  )
}
