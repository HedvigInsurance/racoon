'use client'
import { storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { type Table } from '@/components/ComparisonTable/ComparisonTable.types'
import { DesktopComparisonTable } from '@/components/ComparisonTable/DesktopComparisonTable'
import { MobileComparisonTable } from '@/components/ComparisonTable/MobileComparisonTable'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import type { ContentAlignment, ContentWidth } from '@/components/GridLayout/GridLayout.helper'
import { type StoryblokTableField, type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'

type Props = SbBaseBlockProps<{
  table: StoryblokTableField
  layout?: {
    widths: ContentWidth
    alignment: ContentAlignment
  }
}>

export const ComparisonTableBlock = ({ blok }: Props) => {
  const variant = useResponsiveVariant('md')

  const table = useMemo<Table>(() => {
    const head: Table['head'] = blok.table.thead.map((item) => item.value)
    // We currently don't support descriptions for first column items in storyblok
    // so bellow we're just formatting the data accordingly to match 'Table' type
    const body: Table['body'] = blok.table.tbody.map((row) => {
      const [{ value: rowTitle }, ...remainingValues] = row.body
      const values = remainingValues.map(({ value }) => value)
      return [{ title: rowTitle }, ...values]
    })

    return {
      head,
      body,
    }
  }, [blok])

  return (
    <GridLayout.Root>
      <GridLayout.Content
        width={blok.layout?.widths ?? { base: '1' }}
        align={blok.layout?.alignment ?? 'center'}
      >
        {variant === 'desktop' && (
          <DesktopComparisonTable {...table} {...storyblokEditable(blok)} />
        )}
        {variant === 'mobile' && <MobileComparisonTable {...table} {...storyblokEditable(blok)} />}
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
