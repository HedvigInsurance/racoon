export const transitions = {
  hover: '0.1s ease-out 0s',
  easeInOutCubic: 'cubic-bezier(0.65, 0.05, 0.36, 1)',
  easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
  easeInCubic: 'cubic-bezier(0.55, 0.06, 0.68, 0.19);',
  easeOutCubic: 'cubic-bezier(0.22, 0.61, 0.36, 1);',
} as const

export const framerTransitions = {
  // Source: https://easings.co · easeInOutCubic
  easeInOutCubic: { ease: [0.65, 0.05, 0.36, 1] },
  easeInOutQuint: { ease: [0.86, 0, 0.07, 1] },
  easeInCubic: { ease: [0.55, 0.06, 0.68, 0.19] },
  easeOutCubic: { ease: [0.22, 0.61, 0.36, 1] },
} as const
