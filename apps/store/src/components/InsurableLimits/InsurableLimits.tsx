import styled from '@emotion/styled'
import * as Accordion from '@radix-ui/react-accordion'
import React from 'react'
import { mq, PlusIcon, Text, theme } from 'ui'

type InsurableLimit = {
  label: string
  description: string
  value: string
}

type InsurableLimitsProps = {
  items: Array<InsurableLimit>
}

export const InsurableLimits = ({ items }: InsurableLimitsProps) => {
  return (
    <Accordion.Root type="single" defaultValue={items[0].label}>
      <Layout>
        {items.map((item) => (
          <AccordionItem key={item.label} value={item.label}>
            <div>
              <Accordion.Header>
                <AccordionTrigger>
                  <SingleLineText size="xl">{item.label}</SingleLineText>
                  <PlusIcon />
                </AccordionTrigger>
              </Accordion.Header>
              <Accordion.Content>
                <Text size="xl">{item.description}</Text>
              </Accordion.Content>
            </div>
            <Text size="xxl">{item.value}</Text>
          </AccordionItem>
        ))}
      </Layout>
    </Accordion.Root>
  )
}

const Layout = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,

  [mq.lg]: {
    flexDirection: 'row',
  },
})

const AccordionItem = styled(Accordion.Item)({
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.md,
  padding: theme.space.lg,

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '12rem',
  transition: 'background-color 0.2s ease-in-out, min-height 0.2s ease-in-out',

  '&[data-state=open]': {
    backgroundColor: theme.colors.blueFill2,
    minHeight: '24rem',
  },

  [mq.lg]: {
    height: '24rem',

    '&[data-state=open]': {
      flex: 1,
    },

    '&[data-state=closed]': {
      width: '20%',
    },
  },
})

const SingleLineText = styled(Text)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const AccordionTrigger = styled(Accordion.Trigger)({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space.md,
  cursor: 'pointer',

  '&[data-state=open]': {
    display: 'none',
  },

  ':focus-visible': {
    borderRadius: theme.radius.xs,
    boxShadow: `${theme.colors.textPrimary} 0 0 0 1px`,
  },
})
