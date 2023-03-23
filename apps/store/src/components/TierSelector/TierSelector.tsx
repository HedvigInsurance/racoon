import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronIcon, theme } from 'ui'

type RootProps = { children: React.ReactNode; defaultOpen?: boolean }

export const Root = ({ children, defaultOpen }: RootProps) => {
  return <CollapsibleRoot defaultOpen={defaultOpen}>{children}</CollapsibleRoot>
}

const CollapsibleRoot = styled(Collapsible.Root)({
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,
})

export const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <Trigger>
      <HeaderBody>{children}</HeaderBody>
      <TriggerIcon size={theme.space.md} />
    </Trigger>
  )
}

const Trigger = styled(Collapsible.Trigger)({
  height: '3rem',
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'space-between',
  borderRadius: theme.radius.xs,
  paddingInline: theme.space.md,
})

const HeaderBody = styled.div({
  width: '100%',
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.space.md,
})

const TriggerIcon = styled(ChevronIcon)({
  transition: 'transform 300ms',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
})

export const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <CollapsibleContent>
      <Separator />
      {children}
    </CollapsibleContent>
  )
}

// TODO: unify accordion animation with the one in the block
const slideDown = keyframes({
  from: {
    height: 0,
  },
  to: {
    // custom property reference: https://www.radix-ui.com/docs/primitives/components/collapsible
    height: 'var(--radix-collapsible-content-height)',
  },
})

const slideUp = keyframes({
  from: {
    height: 'var(--radix-collapsible-content-height)',
  },
  to: {
    height: 0,
  },
})

const CollapsibleContent = styled(Collapsible.Content)({
  overflow: 'hidden',

  '[data-state=open] &': {
    animation: `${slideDown} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
  },
  '[data-state=closed] &': {
    animation: `${slideUp} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
  },
})

const Separator = styled.hr({
  height: 1,
  backgroundColor: theme.colors.borderOpaque2,
  marginInline: theme.space.md,
})

export const Footer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Separator />
      <FooterMain>{children}</FooterMain>
    </>
  )
}

const FooterMain = styled.div({
  paddingInline: theme.space.md,
  paddingBlock: theme.space.sm,
})
