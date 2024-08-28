import { theme } from '@hedvig-ui/redesign/theme'
import { style } from '@vanilla-extract/css'

export const css = {
  TasksNavigation: style({
    display: 'flex',
    flexDirection: 'column',

    height: '100%',
    width: 'calc(100% - var(--chat-width))',
    overflow: 'hidden',

    borderRight: `1px solid ${theme.colors.borderTranslucent1}`,
    clipPath: 'inset(0px -10rem 0px 0px)',
    backgroundColor: 'white',
  }),
}
