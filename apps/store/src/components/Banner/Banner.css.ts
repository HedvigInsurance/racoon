import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { colors, minWidth, tokens } from 'ui'

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
    paddingBlock: tokens.space.sm,
    paddingInline: tokens.space.md,
    fontSize: tokens.fontSizes.xs,
    borderBottom: `0.5px solid ${tokens.colors.borderTranslucent1}`,
    '& a': {
      textDecorationLine: 'underline',
      textDecorationThickness: 'clamp(1px, 0.07em, 2px);',
      textUnderlineOffset: '2px',
    },

    '@media': {
      [minWidth.lg]: {
        paddingInline: tokens.space.xl,
      },
    },
  },
  info: {
    color: tokens.colors.blue800,
    backgroundColor: tokens.colors.blueFill1,
  },
  campaign: {
    color: tokens.colors.textGreen,
    backgroundColor: tokens.colors.signalGreenFill,
  },
  warning: {
    color: tokens.colors.textAmber,
    backgroundColor: tokens.colors.signalAmberFill,
  },
  error: {
    color: tokens.colors.textRed,
    backgroundColor: tokens.colors.signalRedFill,
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
  gap: tokens.space.xs,
})

globalStyle(`${bannerContent} b`, {
  color: tokens.colors.textPrimary,
})

export const bannerCloseButton = style({
  gridArea: GridArea.CloseBtn,
  justifySelf: 'end',
  color: colors.textPrimary,
  marginLeft: tokens.space.xs,
  cursor: 'pointer',
  ':focus-visible': {
    outline: `2px solid ${tokens.colors.gray900}`,
  },
})
