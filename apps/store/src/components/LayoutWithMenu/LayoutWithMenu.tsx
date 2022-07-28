import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { SiteFooter, SiteFooterProps } from '@/components/SiteFooter/SiteFooter'
import { TopMenu } from '../TopMenu/TopMenu'

const Wrapper = styled.main({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

type LayoutWithMenuProps = {
  children: ReactNode
}

export const LayoutWithMenu = ({ children }: LayoutWithMenuProps) => {
  const router = useRouter()
  const handleChangeLocale: SiteFooterProps['onChangeLocale'] = (locale) => {
    router.push(router.asPath, undefined, { locale })
  }

  return (
    <Wrapper>
      <TopMenu />
      {children}
      <SiteFooter onChangeLocale={handleChangeLocale} />
    </Wrapper>
  )
}
