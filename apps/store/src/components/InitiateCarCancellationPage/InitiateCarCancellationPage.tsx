import styled from '@emotion/styled'
import Link from 'next/link'
import { type ComponentProps } from 'react'
import { HedvigLogo, Space, mq, theme } from 'ui'
import { ContractCard } from '@/components/ConfirmationPage/ContractCard'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/HeaderStyles'
import { PageLink } from '@/utils/PageLink'

type Props = ComponentProps<typeof ContractCard>

export const InitiateCarCancellationPage = (props: Props) => {
  return (
    <Space y={2}>
      <Header>
        <Link href={PageLink.home()}>
          <HedvigLogo width={78} />
        </Link>
      </Header>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <ContractCard {...props} />
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
