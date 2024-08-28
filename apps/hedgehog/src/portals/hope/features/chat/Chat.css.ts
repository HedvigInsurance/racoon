import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

const Chat = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  maxHeight: '100%',
  maxWidth: 'min(var(--chat-width), 100vw)',
  width: '100%',
  backgroundColor: theme.colors.offWhite,
})

const ChatContent = {
  container: style({
    height: '100%',
    paddingTop: theme.space.xs,
  }),
  heading: style({
    padding: theme.space.lg,
    fontSize: theme.fontSizes.lg,
  }),
  memberInfo: style({
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
  }),
}

const ConversationTopBar = style({
  paddingInline: theme.space.sm,
  paddingBlock: theme.space.md,
  display: 'flex',
  justifyContent: 'space-between',
  margin: theme.space.md,
  borderRadius: theme.radius.md,
  boxShadow: theme.shadow.default,
  backgroundColor: theme.colors.white,
})

export const css = {
  Chat,
  ChatContent,
  ConversationTopBar,
}
