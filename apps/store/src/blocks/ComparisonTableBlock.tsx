import { storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { type Table } from '@/components/ComparisonTable/ComparisonTable.types'
import { DesktopComparisonTable } from '@/components/ComparisonTable/DesktopComparisonTable'
import { MobileComparisonTable } from '@/components/ComparisonTable/MobileComparisonTable'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ContentAlignment, ContentWidth } from '@/components/GridLayout/GridLayout.helper'
import { type StoryblokTableField, type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { useBreakpoint } from '@/utils/useBreakpoint/useBreakpoint'

type Props = SbBaseBlockProps<{
  table: StoryblokTableField
  layout?: {
    widths: ContentWidth
    alignment: ContentAlignment
  }
}>

export const ComparisonTableBlock = ({ blok }: Props) => {
  const matchesMdAndUp = useBreakpoint('md')

  const table = useMemo<Table>(
    () => ({
      head: blok.table.thead.map((item) => item.value),
      body: blok.table.tbody.map((row) => row.body.map(({ value }) => value)),
    }),
    [blok],
  )

  return (
    <GridLayout.Root>
      <GridLayout.Content
        width={blok.layout?.widths ?? { base: '1' }}
        align={blok.layout?.alignment ?? 'center'}
      >
        {matchesMdAndUp ? (
          <DesktopComparisonTable {...table} {...storyblokEditable(blok)} />
        ) : (
          <MobileComparisonTable {...table} {...storyblokEditable(blok)} />
        )}
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

ComparisonTableBlock.blockName = 'comparisonTable'
