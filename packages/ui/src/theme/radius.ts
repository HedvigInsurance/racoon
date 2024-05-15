const base = {
  0: '8',
  1: '10',
  2: '12',
  3: '16',
  4: '20',
  5: '24',
} as const

export const radius = {
  ...base,

  // Aliases
  xxs: base[0],
  xs: base[0],
  sm: base[1],
  md: base[2],
  lg: base[3],
  xl: base[5],
}
