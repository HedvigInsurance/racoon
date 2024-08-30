import * as GridLayout from '@/components/GridLayout/GridLayout'
import { PerilsTable } from '@/components/Perils/PerilsTable/PerilsTable'

export const PerilsTableBlock = () => {
  return (
    <GridLayout.Root>
      <GridLayout.Content width="1">
        <PerilsTable />
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
