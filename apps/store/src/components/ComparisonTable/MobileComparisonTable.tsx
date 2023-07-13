import styled from '@emotion/styled'
import * as RadixTabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { theme } from 'ui'
import { Button } from 'ui'
import * as ComparisonTable from '@/components/ComparisonTable/ComparisonTable'
import { getCellValue } from './ComparisonTable.helpers'
import { type Head, type Body, TableMarkers } from './ComparisonTable.types'

export type MobileComparisonTableProps = {
  head: Head
  body: Body
  defaultSelectedColumn?: string
  className?: string
}

export const MobileComparisonTable = ({
  head,
  body,
  defaultSelectedColumn,
  className,
}: MobileComparisonTableProps) => {
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(() => {
    if (defaultSelectedColumn) {
      return head.findIndex((headerValue) => headerValue === defaultSelectedColumn)
    }

    // First header value is usually an Markers.EmptyHeader.
    return 1
  })

  return (
    <TabsRoot
      className={className}
      defaultValue={defaultSelectedColumn ?? head[selectedColumnIndex]}
      onValueChange={(value) => setSelectedColumnIndex(head.findIndex((tier) => tier === value))}
    >
      <TabsList>
        {head.map((headerValue) => {
          if (headerValue === TableMarkers.EmptyHeader) return null

          return (
            <RadixTabs.Trigger key={headerValue} value={headerValue} asChild>
              <TabButton variant="secondary" size="medium">
                {headerValue}
              </TabButton>
            </RadixTabs.Trigger>
          )
        })}
      </TabsList>

      {head.map((headerValue) => {
        if (headerValue === TableMarkers.EmptyHeader) return null

        return (
          <TabContent key={headerValue} value={headerValue} data-value={headerValue}>
            <ComparisonTable.Root>
              <ComparisonTable.Body>
                {body.map((row) => {
                  const attribute = row[0]
                  const value = row[selectedColumnIndex]

                  return (
                    <ComparisonTable.Row key={attribute}>
                      <ComparisonTable.TitleDataCell>{attribute}</ComparisonTable.TitleDataCell>
                      <ComparisonTable.DataCell alignment="right">
                        {getCellValue(value)}
                      </ComparisonTable.DataCell>
                    </ComparisonTable.Row>
                  )
                })}
              </ComparisonTable.Body>
            </ComparisonTable.Root>
          </TabContent>
        )
      })}
    </TabsRoot>
  )
}

const TabsRoot = styled(RadixTabs.Root)({
  paddingInline: theme.space.xs,
  marginInline: 'auto',
  width: 'min(100%, 21.875rem)',
})

const TabsList = styled(RadixTabs.List)({
  display: 'flex',
  gap: theme.space.xs,
  marginBottom: theme.space.xs,
})

const TabButton = styled(Button)({
  flex: 1,
  '&[data-state=active]': {
    backgroundColor: theme.colors.translucent2,
  },
})

const TabContent = ({ children, ...others }: RadixTabs.TabsContentProps) => {
  return (
    <RadixTabs.Content {...others}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.4,
          },
        }}
      >
        {children}
      </motion.div>
    </RadixTabs.Content>
  )
}
