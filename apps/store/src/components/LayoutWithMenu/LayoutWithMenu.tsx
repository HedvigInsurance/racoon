import styled from '@emotion/styled'
import { ReactElement } from 'react'
import { mq } from 'ui'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/HeaderBlock'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from '../Header/HeaderStyles'

const Wrapper = styled.div({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  isolation: 'isolate',
  marginTop: MENU_BAR_HEIGHT_MOBILE,
  [mq.md]: {
    marginTop: MENU_BAR_HEIGHT_DESKTOP,
  },
})

type LayoutWithMenuProps = {
  children: ReactElement<StoryblokPageProps & { className: string }>
}

export const LayoutWithMenu = ({ children }: LayoutWithMenuProps) => {
  const { story, globalStory, className } = children.props
  const headerBlock = filterByBlockType(globalStory?.content.header, HeaderBlock.blockName)
  const footerBlock = filterByBlockType(globalStory?.content.footer, FooterBlock.blockName)

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
