import { createVar, style } from '@vanilla-extract/css'
import { minWidth, tokens } from 'ui'
import { HEADER_HEIGHT_DESKTOP } from '../Header/Header.css'
import { HEADER_HEIGHT_MOBILE } from '../Header/HeaderMenuMobile/HeaderMenuMobile.css'

const headerHeight = createVar()

export const layout = style({
  vars: {
    [headerHeight]: HEADER_HEIGHT_MOBILE,
  },
  display: 'grid',
  gridTemplateRows: '1fr auto',
  alignItems: 'center',
  height: `calc(100vh - ${headerHeight})`,
  paddingBlock: tokens.space.md,

  '@media': {
    [minWidth.lg]: {
      paddingBlock: tokens.space.xl,
      vars: {
        [headerHeight]: HEADER_HEIGHT_DESKTOP,
      },
    },
  },
})
