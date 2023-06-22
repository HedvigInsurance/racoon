import { css, Global } from '@emotion/react'
import { theme, mq } from 'ui'

const hoverColors = [
  theme.colors.blue600,
  theme.colors.green600,
  theme.colors.amber600,
  theme.colors.red600,
  theme.colors.pink600,
  theme.colors.purple600,
  theme.colors.teal600,
]

const getRandomHoverColor = () => {
  // Random number between 0-6
  const randomNumber = Math.floor(Math.random() * hoverColors.length)
  return hoverColors[randomNumber]
}

export const GlobalLinkStyles = () => {
  const color = getRandomHoverColor()

  return <Global styles={{ ':root': { '--random-hover-color': color } }} />
}

export const linkStyles = css({
  textDecorationLine: 'underline',
  textDecorationColor: theme.colors.gray400,
  textDecorationThickness: 'clamp(1px, 0.07em, 2px);',
  textUnderlineOffset: 5,

  '@media (hover: hover)': {
    '&:hover': {
      textDecorationColor: 'var(--random-hover-color)',
    },
  },
})

export const nestedLinkStyles = css({
  a: linkStyles,
})

export const listStyles = css({
  'ul, ol': {
    marginTop: theme.space.xs,
    marginBottom: theme.space.md,
    marginLeft: theme.space.xs,

    [mq.md]: {
      marginLeft: '1.25rem',
    },

    [mq.lg]: {
      marginLeft: theme.space.xl,
    },
  },

  li: {
    marginBlock: theme.space.xs,
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

    ul: {
      marginLeft: 0,

      'li::before': {
        backgroundColor: 'transparent',
        border: `1px solid ${theme.colors.textSecondary}`,
      },
    },
  },

  '&[data-large-text=true] ul li': {
    [mq.md]: {
      paddingLeft: '1.75rem',
      '&::before': {
        top: 7,
        width: 19,
        height: 19,
      },
    },
  },

  ol: {
    listStyle: 'decimal',

    ol: {
      listStyle: 'lower-alpha',
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

export const richTextStyles = css(
  {
    fontSize: theme.fontSizes.md,
    lineHeight: 1.32,

    '.preamble': {
      display: 'block',
      marginBottom: theme.space.xl,
      fontSize: theme.fontSizes.xl,
      color: theme.colors.textPrimary,
    },

    p: {
      marginTop: theme.space.xs,
      marginBottom: theme.space.lg,
      color: theme.colors.textSecondary,
    },

    'h4 + p': {
      marginTop: 0,
    },

    'li > p': {
      marginBlock: 0,
    },

    'h2, h3, h4': {
      fontSize: theme.fontSizes.md,
    },

    h2: {
      marginTop: theme.space.xxl,
    },

    h3: {
      marginTop: theme.space.xl,
    },

    hr: {
      marginBlock: theme.space.xxxl,
      height: 1,
      backgroundColor: theme.colors.borderOpaque2,
    },

    // Differentiate between inlined images and ImageBlock
    'p > img': {
      maxWidth: `calc(100% + ${theme.space.md})`,
      marginBlock: '4.5rem',
      marginInline: `-${theme.space.xs}`,
      borderRadius: theme.radius.xs,
    },

    [mq.md]: {
      'p > img': {
        maxWidth: '100%',
        marginBlock: theme.space[9],
        marginInline: 0,
        borderRadius: theme.radius.md,
      },
    },

    '&[data-large-text=true]': {
      [mq.md]: {
        fontSize: theme.fontSizes.xl,
        '.preamble': {
          marginBottom: theme.space.xxl,
          fontSize: theme.fontSizes.xxl,
        },

        h2: {
          marginTop: theme.space.xxxl,
          fontSize: theme.fontSizes.xl,
        },

        'h3, h4': {
          marginTop: theme.space.xl,
        },
      },
    },
  },
  nestedLinkStyles,
  listStyles,
)
