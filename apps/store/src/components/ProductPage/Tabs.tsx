import styled from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'
import { zIndexes } from '@/utils/zIndex'

export const Tabs = styled(RadixTabs.Root)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
})

export const TabsList = styled(RadixTabs.TabsList)(({ theme }) => ({
  display: 'flex',
  borderBottom: `1px solid ${theme.colors.gray500}`,
  background: theme.colors.white,
  position: 'sticky',
  top: 0,
  zIndex: zIndexes.tabs,
}))

export const TabsTrigger = styled(RadixTabs.Trigger)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  textAlign: 'center',
  paddingInline: theme.space[2],
  paddingBlock: theme.space[4],
  cursor: 'pointer',

  '&:hover': { color: theme.colors.purple900 },

  '&[data-state=active]': {
    color: theme.colors.purple900,
    boxShadow: `inset 0 -1px 0 0 ${theme.colors.purple900}, 0 1px 0 0 currentColor`,
  },

  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${theme.colors.purple500}`,
  },
}))

export const TabsContent = styled(RadixTabs.Content)({})
