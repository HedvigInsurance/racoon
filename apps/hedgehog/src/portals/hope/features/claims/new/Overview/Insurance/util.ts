export function formatDeductible(
  percentageDeductible: number | null | undefined,
  fixedDeductible: number | null | undefined,
): string | undefined {
  if (!percentageDeductible && !fixedDeductible) {
    return
  }

  if (percentageDeductible) {
    if (fixedDeductible) {
      return `${percentageDeductible}% + ${fixedDeductible}`
    }
    return `${percentageDeductible}%`
  }
  if (fixedDeductible) {
    return `${fixedDeductible} fixed`
  }
}
