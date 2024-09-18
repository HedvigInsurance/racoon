import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { type ReactNode } from 'react'
import { Heading, Space, mq, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { LogoHomeLink } from '@/components/LogoHomeLink'
import { MENU_BAR_HEIGHT_DESKTOP } from '../HeaderNew/Header.css'
import { MENU_BAR_HEIGHT_MOBILE } from '../HeaderNew/HeaderMenuMobile/HeaderMenuMobile.css'

type Props = {
  title?: string
  children: ReactNode
}

export const Layout = (props: Props) => {
  const { t } = useTranslation()

  return (
    <Space y={2}>
      <Header>
        <LogoHomeLink />
      </Header>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={{ base: 2, lg: 3.5 }}>
            <Heading as="h1" variant="standard.24" align="center" balance={true}>
              {props.title || t('PAYMENT_CONNECT_TITLE')}
            </Heading>
            {props.children}
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>
    </Space>
  )
}

const Header = styled(GridLayout.Root)({
  paddingInline: theme.space.md,
  display: 'flex',
  alignItems: 'center',
  height: MENU_BAR_HEIGHT_MOBILE,

  [mq.md]: {
    paddingInline: theme.space.xl,
    gridTemplateRows: MENU_BAR_HEIGHT_DESKTOP,
  },
})
