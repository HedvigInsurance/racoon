export const formatAPIDate = (date: Date) => {
  return date.toISOString().substring(0, 10)
}
