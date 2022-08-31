import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { HeaderBlock } from '@/blocks/TopMenuBlock'
import { SiteFooter, SiteFooterProps } from '@/components/SiteFooter/SiteFooter'

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
  const story = children.props.story
  const globalStory = children.props.globalStory
  const router = useRouter()
  const handleChangeLocale: SiteFooterProps['onChangeLocale'] = (locale) => {
    router.push(router.asPath, undefined, { locale })
  }

  return (
    <Wrapper>
      {children}
      {!story.content.hideMenu && <HeaderBlock blok={globalStory.content} />}
      <SiteFooter onChangeLocale={handleChangeLocale} />
    </Wrapper>
  )
}
