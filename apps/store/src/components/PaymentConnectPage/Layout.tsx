import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { type ReactNode } from 'react'
import { Heading, HedvigLogo, Space, mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { PageLink } from '@/utils/PageLink'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from '../Header/HeaderStyles'

export const Layout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()

  return (
    <Space y={2}>
      <Header>
        <Link href={PageLink.home()}>
          <HedvigLogo width={78} />
        </Link>
      </Header>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={{ base: 2, lg: 3.5 }}>
            <Heading as="h1" variant="standard.24" align="center" balance={true}>
              {t('PAYMENT_CONNECT_TITLE')}
            </Heading>
            {children}
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
