import { Space } from 'ui'
import styled from '@emotion/styled'

export const BulletList = styled(Space)({
  listStyle: 'inside',
  padding: '0.25rem',
  margin: 0,
})

BulletList.defaultProps = { as: 'ul' }

export const Bullet = styled.li(({ theme }) => ({
  fontFamily: theme.fonts.body,
  fontSize: '0.875rem',
  lineHeight: 1,
  color: theme.colors.gray700,
  margin: 0,
  padding: 0,
}))
