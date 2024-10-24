import * as RadixTabs from '@radix-ui/react-tabs'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import * as ComparisonTable from '@/components/ComparisonTable/ComparisonTable'
import { getCellValue } from './ComparisonTable.helpers'
import { type Head, type Body, TableMarkers } from './ComparisonTable.types'
import { tabsRoot, tabsList, tabButton } from './MobileComparisonTable.css'

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
    <RadixTabs.Root
      className={clsx(tabsRoot, className)}
      defaultValue={defaultSelectedColumn ?? head[selectedColumnIndex]}
      onValueChange={(value) => setSelectedColumnIndex(head.findIndex((tier) => tier === value))}
    >
      <RadixTabs.List className={tabsList}>
        {head.map((headerValue) => {
          if (headerValue === TableMarkers.EmptyHeader) return null

          return (
            <RadixTabs.Trigger key={headerValue} value={headerValue} asChild={true}>
              <Button className={tabButton} variant="secondary" size="small">
                {headerValue}
              </Button>
            </RadixTabs.Trigger>
          )
        })}
      </RadixTabs.List>

      {head.map((headerValue) => {
        if (headerValue === TableMarkers.EmptyHeader) return null

        return (
          <TabContent key={headerValue} value={headerValue} data-value={headerValue}>
            <ComparisonTable.Root>
              <ComparisonTable.Body>
                {body.map((row) => {
                  const [rowTitle, ...values] = row
                  // 'selectedColumnIndex' is defined taking the whole table into account. However
                  // 'values' is a subset of the table without the first column, so we need to subtract 1
                  // from the index.
                  const value = values[selectedColumnIndex - 1]

                  return (
                    <ComparisonTable.Row key={rowTitle.title}>
                      <ComparisonTable.TitleDataCell
                        title={rowTitle.title}
                        description={rowTitle.description}
                      />
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
    </RadixTabs.Root>
  )
}

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
