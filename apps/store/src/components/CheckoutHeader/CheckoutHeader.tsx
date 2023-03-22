import styled from '@emotion/styled'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { HedvigLogo, mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { MENU_BAR_HEIGHT_MOBILE, MENU_BAR_HEIGHT_DESKTOP } from '@/components/Header/HeaderStyles'
import { PageLink } from '@/utils/PageLink'
import { Breadcrumbs, BreadcrumbsProps } from './Breadcrumbs'

type Props = BreadcrumbsProps & {
  children: ReactNode
}

export const CheckoutHeader = ({ children, steps, activeStep }: Props) => {
  return (
    <HeaderLayout>
      <HeaderLogo>
        <Link href={PageLink.home()}>
          <HedvigLogo width={78} />
        </Link>
      </HeaderLogo>
      <HeaderBreadcrumbs width="1/3" align="center">
        <Breadcrumbs steps={steps} activeStep={activeStep} />
      </HeaderBreadcrumbs>
      <HeaderBack>{children}</HeaderBack>
    </HeaderLayout>
  )
}

const HeaderLayout = styled(GridLayout.Root)({
  paddingInline: theme.space.md,
  gridTemplateRows: `${MENU_BAR_HEIGHT_MOBILE} ${MENU_BAR_HEIGHT_MOBILE}`,
  alignItems: 'center',

  [mq.md]: {
    paddingInline: theme.space.xl,
    gridTemplateRows: MENU_BAR_HEIGHT_DESKTOP,
  },
})

const HeaderLogo = styled.div({
  gridColumn: '1 / span 6',

  [mq.md]: {
    gridColumn: '1 / span 2',
  },
})

const HeaderBreadcrumbs = styled(GridLayout.Content)({
  gridRow: 2,

  [mq.md]: {
    gridRow: 1,
  },
})

const HeaderBack = styled.div({
  gridColumn: '7 / span 6',
  justifySelf: 'flex-end',

  [mq.md]: {
    gridColumn: '11 / span 2',
  },
})
