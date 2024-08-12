import { style, createVar, styleVariants } from '@vanilla-extract/css'
import { tokens, hoverStyles } from 'ui'
import { zIndexes } from '@/utils/zIndex'

const wrapperBase = style({
  isolation: 'isolate',
})

const inlinePadding = createVar('inputLateralPadding')
export const wrapper = styleVariants({
  small: [
    wrapperBase,
    {
      vars: {
        [inlinePadding]: '0.875rem',
      },
      fontSize: tokens.fontSizes.md,
    },
  ],
  medium: [
    wrapperBase,
    {
      vars: {
        [inlinePadding]: tokens.space.md,
      },
      fontSize: tokens.fontSizes.md,
    },
  ],
  large: [
    wrapperBase,
    {
      vars: {
        [inlinePadding]: tokens.space.md,
      },
      fontSize: tokens.fontSizes.xl,
    },
  ],
})

export const wrapperExpanded = style({
  zIndex: zIndexes.header,
})

export const inputWrapper = style({ position: 'relative' })

const inputBase = style({
  width: '100%',
  paddingLeft: inlinePadding,
  paddingRight: tokens.space.xxxl,
  // Avoids jumpings when border is added for focused state
  border: '1px solid transparent',
  borderRadius: tokens.radius.sm,
  backgroundColor: tokens.colors.translucent1,
  ':focus-within': {
    borderColor: tokens.colors.borderFocusedInput,
  },
})

export const input = styleVariants({
  small: [inputBase, { height: '3rem' }],
  medium: [inputBase, { height: '4rem' }],
  large: [inputBase, { height: '4rem' }],
})

export const inputExpanded = style({
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
})

export const inputWarning = style({
  borderBottomLeftRadius: tokens.radius.sm,
  borderBottomRightRadius: tokens.radius.sm,
})

export const actionsWrapper = style({
  position: 'absolute',
  right: inlinePadding,
  // Vertically center button actions
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  gap: tokens.space.xs,
  alignItems: 'center',
})

export const toggleActionButton = style({
  cursor: 'pointer',
  transition: 'transform 200ms cubic-bezier(0.77,0,0.18,1)',
  selectors: {
    '&[aria-expanded=true]': {
      transform: 'rotate(180deg)',
    },
  },
})

export const deleteActionButton = style({
  cursor: 'pointer',
})

export const list = style({
  width: '100%',
  borderBottomLeftRadius: tokens.radius.sm,
  borderBottomRightRadius: tokens.radius.sm,
  padding: tokens.space.xxs,
  backgroundColor: tokens.colors.translucent1,
  border: `1px solid ${tokens.colors.borderFocusedInput}`,
  borderTop: 'none',
})

export const listHidden = style({
  display: 'none',
})

export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  minHeight: '2.5rem',
  paddingInline: tokens.space.md,
  paddingBlock: tokens.space.xs,
  borderRadius: tokens.radius.md,
  ...hoverStyles({
    cursor: 'pointer',
    backgroundColor: tokens.colors.gray200,
  }),
  ':last-of-type': {
    borderBottomLeftRadius: tokens.radius.sm,
    borderBottomRightRadius: tokens.radius.sm,
  },
})

export const listItemHighlighted = style({
  backgroundColor: tokens.colors.gray200,
})
