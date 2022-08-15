import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { SiteFooter, SiteFooterProps } from '@/components/SiteFooter/SiteFooter'
import { ShopSessionContextProvider } from '@/services/shopSession/ShopSession.context'
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
    <ShopSessionContextProvider>
      <Wrapper>
        <FixedHeader>
          <TopMenu />
        </FixedHeader>
        {children}
        <SiteFooter onChangeLocale={handleChangeLocale} />
      </Wrapper>
    </ShopSessionContextProvider>
  )
}

const FixedHeader = styled.header({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
})
