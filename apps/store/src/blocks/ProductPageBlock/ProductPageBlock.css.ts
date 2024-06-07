import { style } from '@vanilla-extract/css'
import { minWidth, theme } from 'ui/src/theme'
import { MAX_WIDTH } from '@/components/GridLayout/GridLayout.constants'
import { HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header.constants'

export const gridRoot = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  columnGap: theme.space.md,
  paddingInline: theme.space.md,

  width: '100%',
  maxWidth: MAX_WIDTH,
  marginInline: 'auto',
})

export const gridOverview = style({
  gridColumn: '1 / span 12',
  // Even though Overview section comes right after PurchaseForm in the DOM order,
  // it should be "displayed" before PurchaseForm for desktop layout.
  '@media': {
    [minWidth.lg]: {
      gridRow: 1,
      gridColumn: '1 / span 6',
    },
  },
})

export const gridPurchaseForm = style({
  gridColumn: '1 / span 12',

  '@media': {
    [minWidth.lg]: {
      gridColumn: '7 / span 6',
      position: 'sticky',
    },
  },
})

export const purchaseFormWrapper = style({
  paddingTop: '3vw',

  '@media': {
    [minWidth.lg]: {
      position: 'sticky',
      top: HEADER_HEIGHT_DESKTOP,
      // Scroll independently if content is too long
      maxHeight: `calc(100vh - ${HEADER_HEIGHT_DESKTOP})`,
      overflow: 'auto',
      paddingBottom: theme.space.xl,
      paddingTop: '6vw',
    },
  },
})

export const gridCoverage = style({
  gridColumn: '1 / span 12',
})
