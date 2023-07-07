const base = {
  0: 8,
  1: 10,
  2: 12,
  3: 16,
  4: 20,
  5: 28,
} as const

export const radius = {
  ...base,

  // Aliases
  xxs: base[0],
  xs: base[0],
  sm: base[2],
  md: base[3],
  lg: base[4],
  xl: base[5],
}
