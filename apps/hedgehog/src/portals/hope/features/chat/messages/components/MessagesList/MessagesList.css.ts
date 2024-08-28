import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@hedvig-ui/redesign/theme'

const MessagesList = style({
  // "column-reverse" + overflowY: 'auto' makes this work as a bottom-to-top
  // scrollable list, like you typically do with a chat.
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: theme.space.md,
  justifyContent: 'flex-start', // push messages to bottom
  flexGrow: 1, // not optimal to put here, but was too hard to fix it outside

  padding: theme.space.md,
})

globalStyle(`${MessagesList} a`, {
  color: 'inherit',
  textDecoration: 'underline',
})

export const css = {
  MessagesList,
}
