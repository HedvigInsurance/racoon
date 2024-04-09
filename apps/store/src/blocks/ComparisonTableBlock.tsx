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
        {variant === 'desktop' && (
          <DesktopComparisonTable {...table} {...storyblokEditable(blok)} />
        )}
        {variant === 'mobile' && <MobileComparisonTable {...table} {...storyblokEditable(blok)} />}
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
