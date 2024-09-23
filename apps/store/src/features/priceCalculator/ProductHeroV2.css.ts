import { style } from '@vanilla-extract/css'
import { badgeFontColor } from 'ui/src/components/Badge/Badge.css'
import { pillowSize, responsiveStyles, tokens } from 'ui'

export const pillowWrapper = style({
  position: 'relative',
})

export const pillow = style({
  vars: {
    [pillowSize]: '4rem',
  },
  ...responsiveStyles({
    lg: { vars: { [pillowSize]: '13rem' } },
  }),
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
