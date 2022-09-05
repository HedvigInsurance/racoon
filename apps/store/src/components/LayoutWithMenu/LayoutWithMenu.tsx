import styled from '@emotion/styled'
import { StoryData } from '@storyblok/react'
import { ReactElement } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/TopMenuBlock'

const Wrapper = styled.div({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

type LayoutWithMenuProps = {
  children: ReactElement
}

export const LayoutWithMenu = ({ children }: LayoutWithMenuProps) => {
  const story = children.props.story as StoryData | undefined
  const globalStory = children.props.globalStory

  return (
    <Wrapper>
      {(!story || !story.content.hideMenu) && <HeaderBlock blok={globalStory.content} />}
      {children}
      {(!story || !story.content.hideMenu) && <FooterBlock blok={globalStory.content} />}
    </Wrapper>
  )
}
