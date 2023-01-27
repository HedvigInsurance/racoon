import styled from '@emotion/styled'
import { theme } from 'ui'

export const RichTextContent = styled.div({
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
})
