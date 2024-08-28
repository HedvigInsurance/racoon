import { styleVariants } from '@vanilla-extract/css'
import { theme } from '../redesign/theme'

const pillWIdth = '4rem'
const pillHeight = '2rem'
const circleSize = '1.75rem'
const circleBaseOffset = `calc(${pillHeight} - ${circleSize})`
const circleActiveOffset = `calc(100% - ${circleSize} - ${circleBaseOffset})`

export const switchStyles = styleVariants({
  base: {
    borderRadius: '1000vw',
    backgroundColor: theme.colors.buttonPrimaryDisabled,
    width: pillWIdth,
    height: pillHeight,
    position: 'relative',
    cursor: 'pointer',

    '::after': {
      content: '',
      position: 'absolute',
      top: '50%',
      left: circleBaseOffset,
      translate: '0 -50%',
      width: circleSize,
      aspectRatio: '1',
      borderRadius: '50%',
      backgroundColor: theme.colors.white,
      transition: 'left 0.2s',
    },
  },
  active: {
    backgroundColor: theme.colors.signalGreenHighlight,

    '::after': {
      left: circleActiveOffset,
    },
  },
})

export const switchCardStyles = styleVariants({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space.xl,
    borderRadius: theme.space.xs,
    backgroundColor: theme.colors.opaque1,
    color: theme.colors.textSecondary,
    border: '0.5px solid',
    borderColor: theme.colors.borderTranslucent2,
    height: '56px',
    paddingInline: theme.space.md,
    cursor: 'pointer',
  },
  active: {
    backgroundColor: theme.colors.signalGreenFill,
    color: theme.colors.signalGreenText,
  },
})
