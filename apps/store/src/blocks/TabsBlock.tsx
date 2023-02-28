import styled from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { Heading, mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { SbBaseBlockProps, ExpectedBlockType } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type TabBlockFields = {
  title: string
  body: Array<SbBlokData>
}

type TabBlockProps = SbBaseBlockProps<TabBlockFields>

type TabsBlockProps = SbBaseBlockProps<{
  items: ExpectedBlockType<TabBlockProps>
  heading?: string
}>

export const TabsBlock = ({ blok }: TabsBlockProps) => {
  const tabBlocks = filterByBlockType(blok.items, TabBlock.blockName)
  const firstTabValue = tabBlocks[0]?._uid

  return (
    <Wrapper {...storyblokEditable(blok)}>
      {blok.heading && (
        <Title as="h2" variant={{ _: 'standard.24', lg: 'standard.32' }} align="center">
          {blok.heading}
        </Title>
      )}
      <RadixTabs.Tabs defaultValue={firstTabValue}>
        <GridLayout.Root>
          <TabListWrapper width="2/3" align="center">
            <TabList>
              {tabBlocks.map((tabBlock) => {
                const tabId = tabBlock._uid || tabBlock.title
                return (
                  <TabTrigger key={tabId} value={tabId}>
                    {tabBlock.title}
                  </TabTrigger>
                )
              })}
            </TabList>
          </TabListWrapper>

          <GridLayout.Content width="1/2" align="center">
            {tabBlocks.map((tabBlock) => (
              <TabBlock key={tabBlock._uid || tabBlock.title} blok={tabBlock} />
            ))}
          </GridLayout.Content>
        </GridLayout.Root>
      </RadixTabs.Tabs>
    </Wrapper>
  )
}
TabsBlock.blockName = 'tabs'

const TabBlock = ({ blok }: TabBlockProps) => {
  return (
    <RadixTabs.TabsContent value={blok._uid || blok.title}>
      {blok.body.map((nestedBlock) => (
        <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} nested={true} />
      ))}
    </RadixTabs.TabsContent>
  )
}
TabBlock.blockName = 'tab'

// We use this for applying some contextual styles
export const Wrapper = styled.div({})

const Title = styled(Heading)({
  marginBottom: theme.space.lg,
  paddingInline: theme.space.md,

  [mq.lg]: {
    marginBottom: theme.space.xl,
  },
})

const TabListWrapper = styled(GridLayout.Content)({
  marginBottom: theme.space.md,

  [mq.lg]: {
    marginBottom: theme.space.xl,
  },
})

const TabList = styled(RadixTabs.TabsList)({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xxs,
  overflowX: 'auto',
})

const TabTrigger = styled(RadixTabs.Trigger)({
  cursor: 'pointer',
  fontSize: theme.fontSizes.xs,
  borderRadius: theme.radius.sm,
  border: '2px solid transparent',
  padding: ` ${theme.space.xs} ${theme.space.sm}`,
  // So we can center a scrollable flex container.
  // Justify content won't work. https://rb.gy/uii7pl
  ':first-of-type': { marginLeft: 'auto' },
  ':last-of-type': { marginRight: 'auto' },
  '&[data-state="active"] ': {
    backgroundColor: theme.colors.translucent1,
  },
  ':focus-visible': {
    backgroundColor: theme.colors.translucent1,
    borderColor: theme.colors.purple500,
  },

  [mq.md]: {
    fontSize: theme.fontSizes.md,
  },

  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.translucent1,
    },
  },
})
