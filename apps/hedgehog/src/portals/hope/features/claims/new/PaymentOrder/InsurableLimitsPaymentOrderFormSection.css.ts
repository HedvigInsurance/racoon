import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@hedvig-ui/redesign/theme'

const removeCategoryButton = style({
  position: 'absolute',
  top: '-0.5rem',
  right: '-0.5rem',
  aspectRatio: '1',

  cursor: 'pointer',

  opacity: 0,
  zIndex: 1,
  transition: 'opacity 200ms ease-in-out',

  ':hover': {
    opacity: 1,
  },
})

const categoryWrapper = style({
  position: 'relative',
})

const categoryColumnHeading = style({
  color: theme.colors.textSecondary,
  marginBottom: theme.space['2'],
})

const categoryOverflowContainer = style({
  overflow: 'clip',
})

globalStyle(
  `${categoryWrapper}:hover:not(:has(input:focus)) > ${removeCategoryButton}`,
  {
    opacity: 1,
  },
)

const addCategoryButton = style({
  height: '56px',
})

const addCategoryPopup = styleVariants({
  wrapper: {
    overflow: 'clip',
    minWidth: '400px',
    maxWidth: '90vw',
    borderRadius: 'initial',
  },
  option: {
    cursor: 'pointer',
    paddingBlock: theme.space.lg,
    paddingInline: theme.space.md,
    border: 'none',
    ':hover': {
      backgroundColor: theme.colors.translucent1,
    },

    selectors: {
      '&:not(:last-child)': {
        borderBottom: `1px solid ${theme.colors.borderTranslucent1}`,
      },
    },
  },
  mutedText: {
    color: theme.colors.textSecondary,
  },
})

const diagnosis = {
  select: style({
    minWidth: 'max-content',
    width: '400px',
  }),
  dialog: style({ minWidth: '400px' }),
}

export const css = {
  removeCategoryButton,
  categoryColumnHeading,
  categoryWrapper,
  categoryOverflowContainer,
  addCategoryButton,
  addCategoryPopup,
  diagnosis,
}
