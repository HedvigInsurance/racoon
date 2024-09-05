import { useMemo } from 'react'
import {
  TableMarkers,
  type Body,
  type Head,
  type Table,
} from '@/components/ComparisonTable/ComparisonTable.types'
import { DesktopComparisonTable } from '@/components/ComparisonTable/DesktopComparisonTable'
import type { PerilFragment } from '@/services/graphql/generated'
import type { VariantPerils } from '../PerilsTable'
import { tableWrapper } from './PerilsTableDesktop.css'

type Props = {
  allPerils: Array<PerilFragment>
  variantsPerils: Array<VariantPerils>
  heading?: string
}

export function PerilsTableDesktop({ allPerils, variantsPerils, heading }: Props) {
  const { table } = useTableData(allPerils, variantsPerils, heading)
  return (
    <div className={tableWrapper}>
      <DesktopComparisonTable {...table} />
    </div>
  )
}

const variantHasPeril = (perils: Array<PerilFragment>, perilTitle: string) =>
  perils.some((peril) => peril.title === perilTitle)

const useTableData = (
  allPerils: Array<PerilFragment>,
  variantsPerils: Array<VariantPerils>,
  heading?: string,
) => {
  const table = useMemo<Table>(() => {
    const head: Head = [
      heading ?? TableMarkers.EmptyHeader,
      ...variantsPerils.map((variant) => {
        const headerValue = variant.displayNameSubtype
        return headerValue
      }),
    ]

    const body: Body = allPerils.map((peril) => [
      { title: peril.title, description: peril.description, perilsColor: peril.colorCode },
      ...variantsPerils.map((variant) =>
        variantHasPeril(variant.perils, peril.title)
          ? TableMarkers.Covered
          : TableMarkers.NotCovered,
      ),
    ])

    return { head, body }
  }, [variantsPerils, allPerils, heading])

  return { table }
}
