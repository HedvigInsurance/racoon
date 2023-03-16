import { css } from '@emotion/react'
import { getHeadingVariantStyles } from 'ui/src/components/Heading/Heading.helpers'
import { theme, mq } from 'ui'

export const listStyles = css({
  ul: {
    marginLeft: theme.space.xs,
  },

  li: {
    marginBlock: theme.space.md,
  },

  'ul li': {
    position: 'relative',
    paddingLeft: theme.space.lg,

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 5,
      left: 0,
      display: 'inline-block',
      width: 15,
      height: 15,
      borderRadius: '100%',
      backgroundColor: theme.colors.textSecondary,
    },

    [mq.md]: {
      paddingLeft: '1.75rem',
      '&::before': {
        top: 7,
        width: 19,
        height: 19,
      },
    },

    [mq.xl]: {
      paddingLeft: theme.space.xl,
      '&::before': {
        top: 9,
        width: 24,
        height: 24,
      },
    },

    ul: {
      marginLeft: 0,

      'li::before': {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.colors.textSecondary}`,
      },
    },
  },

  ol: {
    marginLeft: theme.space.sm,
    listStyle: 'decimal-leading-zero',

    ol: {
      listStyle: 'lower-alpha',
    },

    [mq.md]: {
      marginLeft: '1.25rem',
    },

    [mq.lg]: {
      marginLeft: theme.space.xl,
    },
  },

  'ol li': {
    marginLeft: theme.space.lg,
    '::marker': {
      color: theme.colors.textSecondary,
    },

    ol: {
      marginLeft: 0,
    },
  },
})

export const linkStyles = css({
  a: {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 1,
      left: 0,
      width: '100%',
      height: 2,
      backgroundColor: theme.colors.borderOpaque,
    },

    '&:hover::after': {
      backgroundColor: theme.colors.blue600,
    },
  },
})

export const richTextStyles = css(
  {
    fontSize: theme.fontSizes.md,
    '.preamble': {
      fontSize: theme.fontSizes.xl,
    },

    p: {
      marginBlock: theme.space.md,
      color: theme.colors.textSecondary,
    },

    'h4 + p': {
      marginTop: 0,
    },

    h2: {
      marginTop: theme.space.xl,
      ...getHeadingVariantStyles({ _: 'standard.24', md: 'standard.32', xl: 'standard.48' }),
    },

    h3: {
      marginTop: theme.space.xl,
      ...getHeadingVariantStyles({ _: 'standard.18', md: 'standard.24', xl: 'standard.32' }),
    },

    h4: {
      marginTop: theme.space.xl,
      ...getHeadingVariantStyles({ _: 'standard.18', md: 'standard.24', xl: 'standard.32' }),
    },

    hr: {
      marginBlock: theme.space.xxxl,
      height: 1,
      backgroundColor: theme.colors.borderOpaque,
    },

    [mq.md]: {
      fontSize: theme.fontSizes.xl,
      '.preamble': {
        fontSize: theme.fontSizes.xxl,
      },

      h2: {
        marginTop: theme.space.xxl,
      },

      h3: {
        marginTop: theme.space.xxl,
      },

      h4: {
        marginTop: theme.space.xxl,
      },
    },

    [mq.xl]: {
      fontSize: theme.fontSizes.xxl,
      '.preamble': {
        fontSize: theme.fontSizes.xxxl,
      },

      h2: {
        marginTop: theme.space.xxxl,
      },

      h3: {
        marginTop: theme.space.xxxl,
      },

      h4: {
        marginTop: theme.space.xxxl,
      },
    },
  },
  linkStyles,
  listStyles,
)
