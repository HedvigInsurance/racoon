import styled from '@emotion/styled'
import type { ReactNode } from 'react'
import { HedvigLogo, mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { Breadcrumbs, BreadcrumbsProps } from './Breadcrumbs'

type Props = BreadcrumbsProps & {
  children: ReactNode
}

export const CheckoutHeader = ({ children, steps, activeStep }: Props) => {
  return (
    <HeaderLayout>
      <HeaderLogo>
        <HedvigLogo width={78} />
      </HeaderLogo>
      <HeaderBreadcrumbs>
        <Breadcrumbs steps={steps} activeStep={activeStep} />
      </HeaderBreadcrumbs>
      <HeaderBack>{children}</HeaderBack>
    </HeaderLayout>
  )
}

const HeaderLayout = styled(GridLayout.Root)({
  paddingInline: theme.space.md,
  gridTemplateRows: '3rem 3rem',
  alignItems: 'center',

  [mq.md]: {
    paddingInline: theme.space.xl,
    gridTemplateRows: '3.5rem',
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
  gridColumn: '1 / span 12',

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
