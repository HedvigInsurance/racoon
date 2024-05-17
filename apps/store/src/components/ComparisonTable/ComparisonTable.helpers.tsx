import { CheckIcon, MissingIcon } from './ComparisonTable'
import { TableMarkers } from './ComparisonTable.types'

export const getCellValue = (value: string) => {
  if (value === TableMarkers.Covered)
    return (
      // TODO: Lokalise this
      <CheckIcon aria-label="Covered" size="1.125rem" />
    )
  if (value === TableMarkers.NotCovered)
    return (
      // TODO: Lokalise this
      <MissingIcon aria-label="Not Covered" size="1.125rem" />
    )
  return value
}
