import { style, styleVariants } from '@vanilla-extract/css'
import { badgeFontColor } from 'ui/src/components/Badge/Badge.css'
import { responsiveStyles, tokens } from 'ui'
import { zIndexes } from '@/utils/zIndex'

export const pillowWrapper = style({
  position: 'relative',
})

export const priceWrapper = style({ position: 'relative', height: tokens.space.lg })

export const priceLabel = style({
  position: 'absolute',
  inset: 0,
  // Make sure there's no layout shift when price appears
  minHeight: tokens.space.lg,
})

export const subTypeLabel = style({
  ...responsiveStyles({
    lg: { display: 'none' },
  }),
})

export const subTypeBadge = style({
  vars: {
    [badgeFontColor]: tokens.colors.textNegative,
  },
  display: 'none',

  ...responsiveStyles({
    lg: {
      display: 'block',
      position: 'absolute',
      top: tokens.space.lg,
      right: `calc(-1 * ${tokens.space.sm})`,
      backgroundColor: 'transparent',
      backdropFilter: 'blur(50px)',
    },
  }),
})

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
