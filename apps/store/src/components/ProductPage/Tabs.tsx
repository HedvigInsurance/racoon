import styled from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'

export const Tabs = styled(RadixTabs.Root)({
  display: 'flex',
  flexDirection: 'column',
})

export const TabsList = styled(RadixTabs.TabsList)({
  flexShrink: 0,
  display: 'flex',
  borderBottom: '1px solid #e3e3e3',
})

export const TabsTrigger = styled(RadixTabs.Trigger)({
  flex: 1,
  padding: '1rem',
  cursor: 'pointer',
  '&:hover': { color: 'mediumpurple' },
  '&[data-state=active]': {
    color: 'mediumpurple',
    boxShadow: 'inset 0 -1px 0 0 mediumpurple, 0 1px 0 0 currentColor',
  },
  '&:focus-visible': {
    boxShadow: '0 0 0 2px black',
  },
})

export const TabsContent = styled(RadixTabs.Content)({})
