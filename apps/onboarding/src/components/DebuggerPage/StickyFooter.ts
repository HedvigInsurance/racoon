import styled from '@emotion/styled'
import { Button, Space } from 'ui'
import { PAGE_WIDTH } from './DebuggerPage.constants'

export const StickyFooter = styled(Space)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  padding: '1rem 0.5rem',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.colors.white,
  boxShadow: `0px -1px 10px rgba(0, 0, 0, 0.1)`,

  [Button.name]: {
    maxWidth: `calc(${PAGE_WIDTH} - 1rem)`,
  },
}))
