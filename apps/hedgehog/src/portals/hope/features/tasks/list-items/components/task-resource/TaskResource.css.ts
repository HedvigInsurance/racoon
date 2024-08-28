import { theme } from '@hedvig-ui/redesign/theme'
import { style, styleVariants } from '@vanilla-extract/css'

const Container = style({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.space.sm,
  paddingBlock: theme.space.xxs,
  paddingInline: theme.space.xs,
  borderRadius: theme.radius.xxs,
  height: 'max-content',
  whiteSpace: 'nowrap',
  minWidth: '8rem',
})

const ResourceType = styleVariants({
  NEW_CLAIM: {
    backgroundColor: theme.colors.green100,
    color: theme.colors.green800,
  },
  CLAIM: {
    backgroundColor: theme.colors.blue100,
    color: theme.colors.blue800,
  },
  QUESTION: {
    backgroundColor: theme.colors.purple100,
    color: theme.colors.purple800,
  },
  STALE_CLAIM: {
    backgroundColor: theme.colors.gray100,
    color: theme.colors.gray800,
  },
})

export const css = {
  Container,
  ResourceType,
}
