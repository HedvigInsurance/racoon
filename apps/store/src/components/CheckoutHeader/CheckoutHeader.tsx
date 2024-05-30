import styled from '@emotion/styled'
import type { ReactNode } from 'react'
import { mq, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import {
  MENU_BAR_HEIGHT_MOBILE,
  MENU_BAR_HEIGHT_DESKTOP,
} from '@/components/Header/Header.constants'
import { LogoHomeLink } from '@/components/LogoHomeLink'
import type { BreadcrumbsProps } from './Breadcrumbs'
import { Breadcrumbs } from './Breadcrumbs'

type Props = BreadcrumbsProps & {
  children: ReactNode
}

export const CheckoutHeader = ({ children, steps, activeStep }: Props) => {
  return (
    <HeaderLayout>
      <HeaderLogo>
        <LogoHomeLink />
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
