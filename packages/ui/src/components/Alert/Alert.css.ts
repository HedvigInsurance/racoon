import { createVar, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { tokens } from '../../theme'

export const AlertBackground = createVar()
export const AlertForeground = createVar()
export const AlertElement = createVar()

export const rootStyles = recipe({
  base: {
    paddingBlock: tokens.space.sm,
    paddingInline: tokens.space.md,
    borderRadius: tokens.radius.md,
    display: 'flex',
    gap: tokens.space.sm,
    backgroundColor: AlertBackground,
  },
  variants: {
    variant: {
      info: {
        vars: {
          [AlertBackground]: tokens.colors.signalBlueFill,
          [AlertForeground]: tokens.colors.signalBlueText,
          [AlertElement]: tokens.colors.signalBlueElement,
        },
      },
      warning: {
        vars: {
          [AlertBackground]: tokens.colors.signalAmberFill,
          [AlertForeground]: tokens.colors.signalAmberText,
          [AlertElement]: tokens.colors.signalAmberElement,
        },
      },
      error: {
        vars: {
          [AlertBackground]: tokens.colors.signalRedFill,
          [AlertForeground]: tokens.colors.signalRedText,
          [AlertElement]: tokens.colors.signalRedElement,
        },
      },
      success: {
        vars: {
          [AlertBackground]: tokens.colors.signalGreenFill,
          [AlertForeground]: tokens.colors.signalGreenText,
          [AlertElement]: tokens.colors.signalGreenElement,
        },
      },
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

export const iconStyles = style({
  marginTop: tokens.space.xxs,
  color: AlertElement,
  flexShrink: 0,
})

export const bodyStyles = style({
  flex: 1,
  // Prevent overflow when seeing untranslated key. Harmless otherwise
  minWidth: 0,
  overflowWrap: 'break-word',
})

export const messageStyles = style({
  color: AlertForeground,
})

export const actionsContainerStyles = style({
  display: 'flex',
  gap: tokens.space.xs,
  marginTop: tokens.space.sm,
})

export const actionStyles = style({
  flex: 1,
})
