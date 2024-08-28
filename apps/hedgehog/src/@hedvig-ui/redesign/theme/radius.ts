const base = {
  0: 4,
  1: 8,
  2: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
} as const

export const radius = {
  ...base,

  // Aliases
  xxs: base[0],
  xs: base[1],
  sm: base[2],
  md: base[3],
  lg: base[4],
  xl: base[5],
  xxl: base[6],
}
