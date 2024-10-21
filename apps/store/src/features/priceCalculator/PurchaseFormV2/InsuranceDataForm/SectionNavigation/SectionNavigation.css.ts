import { style } from '@vanilla-extract/css'
import { responsiveStyles, xStack } from 'ui'

export const sectionNavigationWrapper = style([
  xStack({
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'xxl',
  }),
  {
    ...responsiveStyles({
      lg: {
        marginTop: 0,
      },
    }),
  },
])
