import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

const ConversationList = style({
  overflowY: 'auto',
  flexGrow: '1',
})

const SectionTitle = style({
  padding: theme.space.md,
  paddingBottom: theme.space.sm,
  paddingTop: theme.space.lg,
  fontSize: theme.fontSizes.md,
})

const ConversationListItem = {
  base: style({
    paddingInline: theme.space.lg,
    paddingBlock: theme.space.md,
    cursor: 'pointer',
    borderBottom: '1px solid',
    borderColor: theme.colors.borderTranslucent1,

    selectors: {
      '&:hover': {
        backgroundColor: theme.colors.translucent1,
      },
    },
  }),
  active: style({
    backgroundColor: theme.colors.signalBlueFill,

    selectors: {
      '&:hover': {
        backgroundColor: theme.colors.signalBlueHighlight,
      },
    },
  }),
}
const MessagePreview = {
  container: style({
    color: theme.colors.textSecondary,
  }),
  content: style({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  timestamp: style({
    minWidth: 'max-content',
    fontSize: theme.fontSizes.xs,
  }),
}

export const css = {
  ConversationList,
  SectionTitle,
  ConversationListItem,
  MessagePreview,
}
