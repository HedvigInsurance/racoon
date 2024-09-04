import { storyblokEditable } from '@storyblok/react'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { PerilsTable, type PerilsTableProps } from '@/components/Perils/PerilsTable/PerilsTable'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<PerilsTableProps>

export const PerilsTableBlock = ({ blok }: Props) => {
  return (
    <GridLayout.Root {...storyblokEditable(blok)}>
      <GridLayout.Content width="1">
        <PerilsTable {...blok} />
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
