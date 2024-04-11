import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { colors, minWidth, theme } from 'ui/src/theme'

const GridArea = {
  Content: 'content',
  CloseBtn: 'close-btn',
}

export const bannerRoot = styleVariants({
  base: {
    minHeight: '3rem',
    display: 'grid',
    // Using grid here to perfect center align banner's content, excluding close button
    gridTemplateAreas: `
    ". ${GridArea.Content} ${GridArea.CloseBtn}"
  `,
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    paddingBlock: theme.space.sm,
    paddingInline: theme.space.md,
    fontSize: theme.fontSizes.xs,

    borderBottom: `0.5px solid ${theme.colors.borderTranslucent1}`,

    '@media': {
      [minWidth.lg]: {
        paddingInline: theme.space.xl,
      },
    },
  },
  info: {
    color: theme.colors.blue800,
    backgroundColor: theme.colors.blueFill1,
  },
  campaign: {
    color: theme.colors.textGreen,
    backgroundColor: theme.colors.signalGreenFill,
  },
  warning: {
    color: theme.colors.textAmber,
    backgroundColor: theme.colors.signalAmberFill,
  },
  error: {
    color: theme.colors.textRed,
    backgroundColor: theme.colors.signalRedFill,
  },
})

export const bannerIcon = style({
  alignSelf: 'start',
  // Optical alignment
  marginTop: 1,
})

export const bannerContent = style({
  gridArea: GridArea.Content,
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  alignItems: 'center',
  gap: theme.space.xs,
})

globalStyle(`${bannerContent} b`, {
  color: theme.colors.textPrimary,
})

export const bannerCloseButton = style({
  gridArea: GridArea.CloseBtn,
  justifySelf: 'end',
  color: colors.textPrimary,
  paddingLeft: theme.space.xs,
  cursor: 'pointer',
})
