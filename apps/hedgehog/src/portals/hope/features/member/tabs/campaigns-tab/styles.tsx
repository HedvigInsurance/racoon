import styled from '@emotion/styled'
import { Theme } from '@emotion/react'

const getThemeFromStatus = (theme: Theme, status?: string) => {
  switch (status) {
    case 'ACTIVE':
      return theme.success
    case 'UNREDEEMED':
      return theme.danger
    default:
      return theme.accent
  }
}

export const MemberStatusBadge = styled.div<{ status?: string }>`
  padding: 0.5rem 1rem;
  line-height: 1;
  background: ${({ theme, status }) => getThemeFromStatus(theme, status)};
  border-radius: 16px;
  color: ${({ theme }) => theme.accentContrast};
  text-align: center;
  width: auto;
`

export const SmallTopSpacing = styled.div`
  margin-top: 0.2rem;
`
