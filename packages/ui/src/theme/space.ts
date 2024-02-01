const spaceScale = {
  0: '0.125rem',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.5rem',
  6: '2rem',
  7: '3rem',
  8: '4rem',
  9: '6rem',
  10: '8rem',
} as const

export const space = {
  ...spaceScale,
  none: 0,
  xxxs: spaceScale[0],
  xxs: spaceScale[1],
  xs: spaceScale[2],
  sm: spaceScale[3],
  md: spaceScale[4],
  lg: spaceScale[5],
  xl: spaceScale[6],
  xxl: spaceScale[7],
  xxxl: spaceScale[8],
} as const
