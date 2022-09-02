import styled from '@emotion/styled'
import { StoryData } from '@storyblok/react'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { FooterBlock } from '@/blocks/FooterBlock'
import { HeaderBlock } from '@/blocks/TopMenuBlock'
import { SiteFooterProps } from '@/components/SiteFooter/SiteFooter'

const Wrapper = styled.main({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

type LayoutWithMenuProps = {
  children: ReactElement
}

export const LayoutWithMenu = ({ children }: LayoutWithMenuProps) => {
  const router = useRouter()
  const handleChangeLocale: SiteFooterProps['onChangeLocale'] = (locale) => {
    router.push(router.asPath, undefined, { locale })
  }

  const story = children.props.story as StoryData | undefined
  const globalStory = children.props.globalStory

  return (
    <Wrapper>
      {children}
      {(!story || !story.content.hideMenu) && <HeaderBlock blok={globalStory.content} />}
      {(!story || !story.content.hideMenu) && (
        <FooterBlock blok={globalStory.content} onChangeLocale={handleChangeLocale} />
      )}
    </Wrapper>
  )
}
