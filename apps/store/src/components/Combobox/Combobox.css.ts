import { style, createVar, styleVariants } from '@vanilla-extract/css'
import { tokens, hoverStyles } from 'ui'
import { zIndexes } from '@/utils/zIndex'

const wrapperBase = style({
  isolation: 'isolate',
})
export const wrapper = styleVariants({
  small: [
    wrapperBase,
    {
      fontSize: tokens.fontSizes.md,
    },
  ],
  medium: [
    wrapperBase,
    {
      fontSize: tokens.fontSizes.md,
    },
  ],
  large: [
    wrapperBase,
    {
      fontSize: tokens.fontSizes.xl,
    },
  ],
})

export const wrapperExpanded = style({
  zIndex: zIndexes.header,
})

const inlinePadding = createVar('inputLateralPadding')
export const inputWrapper = style({
  vars: {
    [inlinePadding]: tokens.space.md,
  },
  position: 'relative',
})
export const inputWrapperSmall = style({
  vars: {
    [inlinePadding]: '0.875rem',
  },
})

const inputBase = style({
  width: '100%',
  paddingLeft: inlinePadding,
  paddingRight: tokens.space.xxxl,
  // Avoids jumpings when border is added for focused state.
  // We can't easily achive that with `outline` for this case as we do for TextField.
  border: '1px solid transparent',
  borderRadius: tokens.radius.sm,
  backgroundColor: tokens.colors.translucent1,
  ':focus-within': {
    borderColor: tokens.colors.borderFocusedInput,
  },
})

export const input = styleVariants({
  small: [inputBase, { height: '3.5rem' }],
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

export const inputWithLabel = styleVariants({
  small: { paddingTop: '1.5rem', paddingBottom: '0.5rem' },
  medium: { paddingTop: '1.625rem', paddingBottom: '0.375rem' },
  large: { paddingTop: '1.625rem', paddingBottom: '0.5rem' },
})

const inputLabelBase = style({
  position: 'absolute',
  color: tokens.colors.textSecondary,
  lineHeight: 1,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  pointerEvents: 'none',
  transformOrigin: 'top left',
  transition: 'transform 200ms',
})

// Transform logic
// - `scale` is calculated to make small label have desired font size.
//   Unfortunately, we cannot refer to our tokens since we need unitless values for calc
// - `translateY` is matched manually to sync final look with figma
export const inputLabel = styleVariants({
  small: [
    inputLabelBase,
    {
      transform: `translate(${inlinePadding}, 100%) scale(1)`,
      selectors: {
        [`:is(${inputWrapper}:focus-within, ${inputWrapper}[data-active=true])  &`]: {
          transform: `translate(${inlinePadding}, 40%) scale(${14 / 18})`,
        },
      },
    },
  ],
  medium: [
    inputLabelBase,
    {
      transform: `translate(${inlinePadding}, 125%) scale(1)`,
      selectors: {
        [`:is(${inputWrapper}:focus-within, ${inputWrapper}[data-active=true])  &`]: {
          transform: `translate(${inlinePadding}, 70%) scale(${14 / 18})`,
        },
      },
    },
  ],
  large: [
    inputLabelBase,
    {
      transform: `translate(${inlinePadding}, 75%) scale(1)`,
      selectors: {
        [`:is(${inputWrapper}:focus-within, ${inputWrapper}[data-active=true])  &`]: {
          transform: `translate(${inlinePadding}, 40%) scale(${14 / 24})`,
        },
      },
    },
  ],
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
    backgroundColor: tokens.colors.grayTranslucent200,
  }),
  ':last-of-type': {
    borderBottomLeftRadius: tokens.radius.sm,
    borderBottomRightRadius: tokens.radius.sm,
  },
})

export const listItemHighlighted = style({
  backgroundColor: tokens.colors.grayTranslucent200,
})
