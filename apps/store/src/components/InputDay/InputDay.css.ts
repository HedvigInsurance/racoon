import { style, keyframes, styleVariants, globalStyle } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

const slideUpAndFadeAnimation = keyframes({
  '0%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const slideDownAndFadeAnimation = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

export const trigger = style({
  position: 'relative',
  width: '100%',
  height: '4.5rem',
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.translucent1,
  cursor: 'pointer',
  ':focus-visible': {
    boxShadow: theme.shadow.focus,
    borderRadius: theme.radius.sm,
  },
})

export const label = style({
  position: 'absolute',
  left: theme.space.md,
  top: theme.space.sm,
  fontSize: theme.fontSizes.xs,
  overflow: 'visible',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: theme.colors.textSecondary,
  selectors: {
    '&[data-disabled=true]': {
      color: theme.colors.textSecondary,
    },
  },
})

export const innerWrapper = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: theme.space.xl,
  paddingRight: '1.25rem',
  paddingBottom: theme.space.sm,
  paddingLeft: theme.space.md,
})

const chevronIconBase = style({
  pointerEvents: 'none',
})
export const chevronIcon = styleVariants({
  animated: [
    chevronIconBase,
    {
      transition: 'transform 200ms cubic-bezier(0.77,0,0.18,1)',
      selectors: {
        [`${trigger}[data-state=open] &`]: {
          transform: 'rotate(180deg)',
        },
      },
    },
  ],
  left: [
    chevronIconBase,
    {
      transform: 'rotate(90deg)',
    },
  ],
  right: [
    chevronIconBase,
    {
      transform: 'rotate(-90deg)',
    },
  ],
})

export const popoverContent = style({
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.backgroundStandard,
  boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 12px',
  maxHeight: 'var(--radix-tooltip-content-available-height)',
  animationDuration: '0.6s',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  transformOrigin: 'var(--radix-tooltip-content-transform-origin)',
  selectors: {
    '&[data-side="top"]': {
      animationName: slideUpAndFadeAnimation,
      animationFillMode: 'forwards',
    },

    '&[data-side="bottom"]': {
      animationName: slideDownAndFadeAnimation,
      animationFillMode: 'forwards',
    },
  },
})

export const dayPicker = style({
  padding: theme.space.md,
  fontFamily: theme.fonts.body,
  color: theme.colors.textPrimary,
})
globalStyle(`${dayPicker} .rdp-day, ${dayPicker} .rdp-nav_button`, {
  height: 'calc(var(--rdp-cell-size) * 0.9)',
  width: 'calc(var(--rdp-cell-size) * 0.9)',
  borderRadius: theme.radius.xs,
})
globalStyle(`${dayPicker} .rdp-day_today`, {
  fontWeight: 'normal',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.gray200,
})
globalStyle(`${dayPicker} .rdp-day_today:not(.rdp-day_outside)`, {
  fontWeight: 'normal',
  backgroundColor: theme.colors.gray200,
})
globalStyle(`${dayPicker} .rdp-day_today[aria-selected=true]`, {
  backgroundColor: 'var(--rdp-accent-color)',
})
globalStyle(`${dayPicker} .rdp-caption_label`, {
  fontWeight: 'normal',
  borderWidth: 1,
})
globalStyle(`${dayPicker} .rdp-head_cell`, {
  color: theme.colors.textSecondary,
  fontWeight: 'normal',
})