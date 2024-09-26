const zIndexOrder = [
  'body',
  'tabs',
  'scrollPast',
  'header',
  'productHeader',
  'contactUs',
  'cookieBanner',
] as const

type ZIndexValues = (typeof zIndexOrder)[number]
type ZIndexRecord = Record<ZIndexValues, number>

export const zIndexes = zIndexOrder.reduce(
  (acc: ZIndexRecord, current: ZIndexValues, index: number) => {
    acc[current] = index
    return acc
  },
  {} as ZIndexRecord,
)
