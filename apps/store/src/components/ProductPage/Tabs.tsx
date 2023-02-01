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
  gap: theme.space[2],
  position: 'sticky',
  top: theme.space[3],
  paddingInline: theme.space[4],
  zIndex: zIndexes.tabs,
})

export const TabsTrigger = styled(RadixTabs.Trigger)({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  textAlign: 'center',
  paddingInline: theme.space[4],
  paddingBlock: theme.space[2],
  fontSize: theme.fontSizes[3],
  lineHeight: theme.fontSizes[5],
  color: theme.colors.dark,
  // TODO: See if we should define translucent colors in theme
  backgroundColor: 'rgba(242, 242, 242, 0.6)',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.radius.sm,
  cursor: 'pointer',

  '&[data-state=active]': {
    paddingInline: '3.75rem',
    color: theme.colors.dark,
    backgroundColor: 'rgba(205, 205, 205, 0.6)',
  },

  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${theme.colors.purple500}`,
  },
})

export const TabsContent = styled(RadixTabs.Content)({})
