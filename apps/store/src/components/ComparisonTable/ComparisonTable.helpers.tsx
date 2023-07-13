import { CheckIcon, MissingIcon } from './ComparisonTable'
import { TableMarkers } from './ComparisonTable.types'

export const getCellValue = (value: string) => {
  if (value === TableMarkers.Covered)
    return (
      // TODO: Lokalise this
      <CheckIcon aria-label="Covered" />
    )
  if (value === TableMarkers.NotCovered)
    return (
      // TODO: Lokalise this
      <MissingIcon aria-label="Not Covered" />
    )
  return value
}
