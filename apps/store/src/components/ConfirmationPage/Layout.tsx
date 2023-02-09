import styled from '@emotion/styled'
import { mq } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'

const Content = styled(GridLayout.Content)({
  [mq.xl]: {
    gridColumn: '4 / span 6',
  },

  [mq.xxl]: {
    gridColumn: '5 / span 4',
  },
})

export const Layout = {
  Root: GridLayout.Root,
  Content,
}
