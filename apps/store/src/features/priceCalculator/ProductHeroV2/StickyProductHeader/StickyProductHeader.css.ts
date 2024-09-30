import { style, styleVariants } from '@vanilla-extract/css'
import { responsiveStyles, tokens } from 'ui'
import { zIndexes } from '@/utils/zIndex'

export const stickyProductHeader = style({
  insetInlineStart: 0,
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: zIndexes.productHeader,
  pointerEvents: 'none',

  ...responsiveStyles({
    lg: {
      display: 'none',
    },
  }),
})

export const stickyProductHeaderContent = styleVariants({
  base: {
    position: 'sticky',
    top: 0,
    backgroundColor: tokens.colors.backgroundStandard,
    transform: 'translateY(-100%)',
    transition: 'transform .3s ease-in-out',
    boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 12px',
  },
  visible: {
    pointerEvents: 'auto',
    transform: 'translateY(0)',
  },
})
