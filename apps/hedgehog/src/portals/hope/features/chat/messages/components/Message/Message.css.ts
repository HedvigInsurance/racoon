import { theme } from '@hedvig-ui/redesign/theme'
import { style, styleVariants } from '@vanilla-extract/css'

const chatBubble = styleVariants({
  base: {
    backgroundColor: theme.colors.chatBubbleMember,
    padding: theme.space.md,
    maxWidth: '70%',
    borderRadius: theme.radius.lg,
    marginBottom: theme.space.xxs,
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontSize: theme.fontSizes.sm,
  },

  admin: {
    backgroundColor: theme.colors.chatBubbleAdmin,
    color: theme.colors.textNegative,
  },
})

const message = {
  wrapper: {
    base: style({
      width: '100%',
    }),
    withOutboundForwarding: style({
      display: 'grid',
      gridTemplateColumns: `calc(100% - ${theme.space.xl}) 1fr`,
      gap: theme.space.md,
    }),
  },
}

const authorLabel = style({
  fontSize: theme.fontSizes.xs,
  marginInline: theme.space.xs,
})

const timestampLabel = style({
  fontSize: theme.fontSizes.xs,
  color: theme.colors.textSecondary,
  marginInline: theme.space.xs,
})

export const css = {
  chatBubble,
  message,
  authorLabel,
  timestampLabel,
}
