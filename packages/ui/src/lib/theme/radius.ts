const base = {
  0: 8,
  1: 12,
  2: 16,
  3: 20,
  4: 28,
} as const

export const radius = {
  ...base,

  // Aliases
  xs: base[0],
  sm: base[1],
  md: base[2],
  lg: base[3],
  xl: base[4],
}
