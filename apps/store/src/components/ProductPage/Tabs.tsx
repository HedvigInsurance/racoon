import styled from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'
import { theme } from 'ui'
import { zIndexes } from '@/utils/zIndex'

export type { TabsProps } from '@radix-ui/react-tabs'

export const Tabs = styled(RadixTabs.Root)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  isolation: 'isolate',
})

export const TabsList = styled(RadixTabs.TabsList)({
  display: 'grid',
  gap: theme.space.xs,
  position: 'sticky',
  top: theme.space.sm,
  paddingInline: theme.space.md,
  zIndex: zIndexes.tabs,
})

export const TabsTrigger = styled(RadixTabs.Trigger)({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  textAlign: 'center',
  paddingInline: theme.space.md,
  paddingBlock: theme.space.xs,
  fontSize: theme.fontSizes.md,
  lineHeight: theme.fontSizes.xl,
  color: theme.colors.dark,
  backgroundColor: theme.colors.grayTranslucent50,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.radius.sm,
  cursor: 'pointer',

  '&[data-state=active]': {
    paddingInline: '3.75rem',
    color: theme.colors.dark,
    backgroundColor: theme.colors.grayTranslucent300,
  },

  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${theme.colors.purple500}`,
  },
})

export const TabsContent = styled(RadixTabs.Content)({})
