import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@hedvig-ui/redesign/theme'

export const editor = style({})
export const view = style({})

export const toolbar = style({
  display: 'flex',
  alignItems: 'stretch',
  width: 'fit-content',
  backgroundColor: theme.colors.translucent1,
  borderRadius: theme.radius.md,
  gap: theme.space.xs,
  padding: theme.space.xxs,
})

export const highlight = style({
  backgroundColor: theme.colors.yellow600,
})

export const verticalLine = style({
  backgroundColor: theme.colors.opaque3,
  width: '1px',
  marginBlock: theme.space.xs,
})

globalStyle(`${editor} .tiptap`, {
  minHeight: '6em', // ~3 lines
  maxHeight: '18em', // ~9 lines
  overflowY: 'auto',
  marginBlock: '0.75rem',
  paddingBlock: '0.75rem',
  marginInline: theme.space.xxs, // looks more optically aligned with toolbar
})

globalStyle('.tiptap li', {
  marginLeft: '1.5em',
})

const BLOCK_QUOTE_MARGIN_BLOCK = '0.75em'
const BLOCK_QUOTE_MARGIN_LEFT = '1em'

globalStyle('.tiptap blockquote', {
  marginBlock: BLOCK_QUOTE_MARGIN_BLOCK,
  marginLeft: BLOCK_QUOTE_MARGIN_LEFT,
  position: 'relative',
})

globalStyle('.tiptap blockquote::before', {
  backgroundColor: theme.colors.opaque2,
  width: '4px',
  borderRadius: '100vw',
  top: `calc(-${BLOCK_QUOTE_MARGIN_BLOCK} / 2)`,
  bottom: `calc(-${BLOCK_QUOTE_MARGIN_BLOCK} / 2)`,
  left: `-${BLOCK_QUOTE_MARGIN_LEFT}`,
  content: '',
  position: 'absolute',
})

globalStyle('.ProseMirror:focus', {
  outline: 'none',
})

// https://tiptap.dev/docs/editor/api/extensions/placeholder#additional-setup
globalStyle(`${editor} .tiptap p.is-editor-empty:first-child::before`, {
  color: theme.colors.textSecondary,
  content: 'attr(data-placeholder)', // what is this?
  float: 'left',
  height: 0,
  pointerEvents: 'none',
})
