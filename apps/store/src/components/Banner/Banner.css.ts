import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { colors, minWidth, themeVars } from 'ui/src/theme'

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
    paddingBlock: themeVars.space.sm,
    paddingInline: themeVars.space.md,
    fontSize: themeVars.fontSizes.xs,

    borderBottom: `0.5px solid ${themeVars.colors.borderTranslucent1}`,

    '@media': {
      [minWidth.lg]: {
        paddingInline: themeVars.space.xl,
      },
    },
  },
  info: {
    color: themeVars.colors.blue800,
    backgroundColor: themeVars.colors.blueFill1,
  },
  campaign: {
    color: themeVars.colors.textGreen,
    backgroundColor: themeVars.colors.signalGreenFill,
  },
  warning: {
    color: themeVars.colors.textAmber,
    backgroundColor: themeVars.colors.signalAmberFill,
  },
  error: {
    color: themeVars.colors.textRed,
    backgroundColor: themeVars.colors.signalRedFill,
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
  gap: themeVars.space.xs,
})

globalStyle(`${bannerContent} b`, {
  color: themeVars.colors.textPrimary,
})

export const bannerCloseButton = style({
  gridArea: GridArea.CloseBtn,
  justifySelf: 'end',
  color: colors.textPrimary,
  marginLeft: themeVars.space.xs,
  cursor: 'pointer',
  ':focus-visible': {
    outline: `2px solid ${themeVars.colors.gray900}`,
  },
})
