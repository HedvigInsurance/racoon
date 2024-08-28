import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@hedvig-ui/redesign/theme'

export const richText = style({
  fontFamily: 'Hedvig-Letters, sanf-serif',
})

/*
This list styling is terrible, but the only other options are
- living with browser styles
- using :before to emulate list markers
https://css-tricks.com/everything-you-need-to-know-about-the-gap-after-the-list-marker/
*/
globalStyle(`${richText} ul, ${richText} ol`, {
  listStylePosition: 'inside',
  paddingLeft: '1ch',
})

globalStyle(`${richText} ul`, {
  listStyleType: `'• '`,
})

globalStyle(`${richText} blockquote`, {
  margin: 0,
  paddingLeft: '1ch',
  borderLeft: `solid 2px ${theme.colors.gray500}`,
})

globalStyle(`${richText} p:not(:first-child)`, {
  marginTop: '0.5rem',
})
globalStyle(`${richText} p:not(:last-child)`, {
  marginBottom: '0.5rem',
})
