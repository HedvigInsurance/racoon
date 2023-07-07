import { CSSObject } from '@emotion/react'
import { Level, mq } from '../../lib/media-query'
import { theme } from '../../lib/theme/theme'

const HEIGHT = {
  large: '3.5rem',
  medium: '2.5rem',
  small: '2rem',
}

type ButtonSizeVariant = 'small' | 'medium' | 'large'

export type ButtonSize = ButtonSizeVariant | Partial<Record<Level | 'base', ButtonSizeVariant>>

export const getButtonSizeStyles = (size: ButtonSize) => {
  if (typeof size !== 'object') {
    return SIZE_STYLES[size]
  }

  const styles = Object.entries(size).reduce((acc, [level, variant]) => {
    if (level === 'base') return { ...acc, ...SIZE_STYLES[variant] }

    return {
      ...acc,
      [mq[level as Level]]: {
        ...SIZE_STYLES[variant],
      },
    }
  }, {} as CSSObject)

  return styles
}

const SIZE_STYLES = {
  small: {
    height: HEIGHT.small,
    paddingInline: theme.space.md,
    fontSize: theme.fontSizes.xs,
    borderRadius: theme.radius.xxs,
  },
  medium: {
    height: HEIGHT.medium,
    paddingInline: theme.space.md,
    fontSize: theme.fontSizes.md,
    borderRadius: theme.radius.xs,
  },
  large: {
    height: HEIGHT.large,
    width: '100%',
    paddingInline: theme.space.xl,
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
    borderRadius: theme.radius.sm,
  },
} as const
