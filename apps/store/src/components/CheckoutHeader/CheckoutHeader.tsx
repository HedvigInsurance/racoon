import styled from '@emotion/styled'
import type { ReactNode } from 'react'
import { HedvigLogo, mq, theme } from 'ui'
import { Breadcrumbs, BreadcrumbsProps } from './Breadcrumbs'

type Props = BreadcrumbsProps & {
  children: ReactNode
}

export const CheckoutHeader = ({ children, steps, activeStep }: Props) => {
  return (
    <Header>
      <HeaderLogo>
        <HedvigLogo width={78} />
      </HeaderLogo>
      <HeaderBreadcrumbs>
        <Breadcrumbs steps={steps} activeStep={activeStep} />
      </HeaderBreadcrumbs>
      <HeaderBack>
        <HeaderLink>{children}</HeaderLink>
      </HeaderBack>
    </Header>
  )
}

const Header = styled.header({
  display: 'grid',
  gridTemplateAreas: `
    'logo back'
    'breadcrumbs breadcrumbs'
  `,
  gridTemplateColumns: '1fr auto',
  gridTemplateRows: '3rem 3rem',
  alignItems: 'center',

  [mq.md]: {
    gridTemplateAreas: `
      'logo breadcrumbs back'
    `,
    gridTemplateColumns: '1fr minmax(28rem, 33%) 1fr',
    gridTemplateRows: '3.5rem',
  },
})

const HeaderLogo = styled.div({ gridArea: 'logo' })
const HeaderBreadcrumbs = styled.div({ gridArea: 'breadcrumbs' })
const HeaderBack = styled.div({ gridArea: 'back', justifySelf: 'flex-end' })

const HeaderLink = styled.div({
  [mq.lg]: {
    position: 'absolute',
    top: theme.space.md,
    right: theme.space.md,
  },
})
