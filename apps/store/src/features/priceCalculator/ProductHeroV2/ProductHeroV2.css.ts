import { style } from '@vanilla-extract/css'
import { badgeFontColor } from 'ui/src/components/Badge/Badge.css'
import { responsiveStyles, tokens, yStack } from 'ui'
import { HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header.css'

export const productHeroWrapper = style([
  yStack({ justifyContent: 'center', alignItems: 'center', gap: { _: 'xs', lg: 'md' } }),
  {
    height: '13rem',

    ...responsiveStyles({
      lg: {
        // Visually center Product Hero
        marginTop: `calc(-1 * ${HEADER_HEIGHT_DESKTOP})`,
      },
    }),
  },
])

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
