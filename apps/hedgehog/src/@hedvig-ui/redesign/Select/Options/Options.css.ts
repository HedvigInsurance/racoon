import { style } from '@vanilla-extract/css'
import { theme } from '../../theme'
import {
  borderRadius,
  borderWidth,
  minHeight,
  paddingInline,
} from '@hedvig-ui/redesign/InputWrapper/InputWrapper.css'

export const options = style({
  display: 'none',
  position: 'absolute',
  left: `calc(-2 * ${borderWidth})`,
  width: `calc(100% + 4 * ${borderWidth})`,
  zIndex: 2,
  overflow: 'hidden',
  borderRadius,
  border: `0.5px solid ${theme.colors.borderTranslucent2}`,
  backgroundColor: theme.colors.opaque1,
  color: theme.colors.textPrimary,
  listStyle: 'none',
  padding: 0,
  margin: 0,
})

export const optionsOpen = style({
  display: 'block',
  borderTop: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
})

export const option = style({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  height: minHeight,
  padding: paddingInline,

  ':before': {
    content: '',
    position: 'absolute',
    top: 0,
    left: '2.5%',
    width: '95%',
    height: borderWidth,
    backgroundColor: theme.colors.borderTranslucent2,
  },
})

export const selectionIcon = style({
  marginInlineStart: 'auto',
})

export const optionHighlighted = style({
  backgroundColor: theme.colors.opaque2,
})
