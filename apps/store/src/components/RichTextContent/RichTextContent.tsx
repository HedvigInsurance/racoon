import styled from '@emotion/styled'
import { theme } from 'ui'

export const RichTextContent = styled.div({
  '& > p': {
    marginBlock: theme.space.md,
  },
  '& b': {
    fontWeight: 'bold',
  },
  '& i': {
    fontStyle: 'italic',
  },
  '& strike': {
    textDecoration: 'line-through',
  },
  '& u': {
    textDecoration: 'underline',
  },
  '& :where(ul, ol)': {
    paddingLeft: theme.space.xl,
    marginBlock: theme.space.md,
  },
  '& ul': {
    listStyle: 'disc',
  },
  '& ol': {
    listStyle: 'decimal',
  },
  '& a': {
    cursor: 'pointer',
    color: theme.colors.black,

    // apply hover styles only when the device supports them
    '@media (hover: hover) and (pointer: fine)': {
      ':hover': {
        textDecoration: 'underline',
      },
    },
  },
})
