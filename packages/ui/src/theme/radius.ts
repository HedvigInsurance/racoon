const base = {
  0: '8px',
  1: '10px',
  2: '12px',
  3: '16px',
  4: '20px',
  5: '24px',
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
