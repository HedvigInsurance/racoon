import { style, styleVariants } from '@vanilla-extract/css'
import { badgeFontColor } from 'ui/src/components/Badge/Badge.css'
import { pillowSize, responsiveStyles, sprinkles, tokens, yStack } from 'ui'
import { HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header.css'

export const productHeroWrapper = styleVariants({
  base: [
    yStack({ justifyContent: 'center', alignItems: 'center', gap: 'md' }),
    {
      paddingBlock: tokens.space.xxl,
      ...responsiveStyles({
        lg: {
          // Visually center Product Hero
          marginTop: `calc(-1 * ${HEADER_HEIGHT_DESKTOP})`,
        },
      }),
    },
  ],
  hidden: {
    display: 'none',
    ...responsiveStyles({
      lg: {
        display: 'flex',
      },
    }),
  },
})

export const pillowWrapper = style({
  position: 'relative',
})

export const pillow = style({
  vars: {
    [pillowSize]: '10rem',
  },
  ...responsiveStyles({
    lg: {
      vars: {
        [pillowSize]: '13rem',
      },
    },
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

export const mobileCloseButton = style([
  sprinkles({
    marginBottom: 'auto',
    marginLeft: 'auto',
  }),
  { width: tokens.space.xl, height: tokens.space.xl },
])
