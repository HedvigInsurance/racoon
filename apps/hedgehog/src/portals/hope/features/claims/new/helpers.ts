export const sumOfAmounts = (
  values: Array<{ amount: { amount: number; currency: string } }>,
) => {
  const number = values.reduce((acc, value) => acc + value.amount.amount, 0)
  const currency = values.length ? values[0].amount.currency : 'SEK'
  const format = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    currency,
  })
  return format.format(number)
}
