import { style } from '@vanilla-extract/css'
import { minWidth, theme } from 'ui/src/theme'
import { HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header.constants'

export const gridRoot = style({
  // TODO: Ideally padding that are currently spacing content from the edge of the page
  // should be added by the container.
  paddingInline: 0,
})

export const gridOverview = style({
  // Even though Overview section comes right after PurchaseForm in the DOM order,
  // it should be "displayed" before PurchaseForm for desktop layout.
  '@media': {
    [minWidth.lg]: {
      gridRow: 1,
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
