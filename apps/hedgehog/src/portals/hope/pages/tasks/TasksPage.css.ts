import { style } from '@vanilla-extract/css'

export const css = {
  wrapper: style({
    display: 'flex',
    height: '100%',
    overflowY: 'hidden',
  }),
  backButtonContainer: style({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '4.5rem',
    padding: '1.5rem',
  }),
}
