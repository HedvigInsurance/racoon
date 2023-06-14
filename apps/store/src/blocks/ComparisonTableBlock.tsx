import { storyblokEditable } from '@storyblok/react'
import * as ComparisonTable from '@/components/ComparisonTable/ComparisonTable'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ContentAlignment, ContentWidth } from '@/components/GridLayout/GridLayout.helper'
import { type StoryblokTableField, type SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  table: StoryblokTableField
  layout?: {
    widths: ContentWidth
    alignment: ContentAlignment
  }
}>

export const ComparisonTableBlock = ({ blok }: Props) => {
  return (
    <GridLayout.Root>
      <GridLayout.Content
        width={blok.layout?.widths ?? { base: '1' }}
        align={blok.layout?.alignment ?? 'center'}
      >
        <ComparisonTable.Root {...storyblokEditable(blok)}>
          <ComparisonTable.Head>
            <tr>
              {blok.table.thead.map((item) => (
                <ComparisonTable.Header key={item._uid} {...storyblokEditable(item)}>
                  {item.value}
                </ComparisonTable.Header>
              ))}
            </tr>
          </ComparisonTable.Head>
          <ComparisonTable.Body>
            {blok.table.tbody.map((row) => (
              <ComparisonTable.Row key={row._uid} {...storyblokEditable(row)}>
                {row.body.map((cell) =>
                  cell.value.startsWith('*') ? (
                    <ComparisonTable.TitleDataCell key={cell._uid} {...storyblokEditable(cell)}>
                      {cell.value.replace(/^\*/, '')}
                    </ComparisonTable.TitleDataCell>
                  ) : (
                    <ComparisonTable.DataCell key={cell._uid} {...storyblokEditable(cell)}>
                      {getCellValue(cell.value)}
                    </ComparisonTable.DataCell>
                  ),
                )}
              </ComparisonTable.Row>
            ))}
          </ComparisonTable.Body>
        </ComparisonTable.Root>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

const getCellValue = (value: string) => {
  if (value === '[*]') return <ComparisonTable.CheckIcon />
  if (value === '[]') return <ComparisonTable.MissingIcon />
  return value
}

ComparisonTableBlock.blockName = 'comparisonTable'
