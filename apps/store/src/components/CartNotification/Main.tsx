import styled from '@emotion/styled'
import { Space } from 'ui'

export const Main = styled(Space)(({ theme }) => ({
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
  paddingBottom: theme.space[3],
}))
