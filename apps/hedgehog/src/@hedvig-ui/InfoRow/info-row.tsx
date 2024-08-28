import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import chroma from 'chroma-js'

export const InfoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const InfoRow = styled.span`
  margin-bottom: 0.25rem;
  display: flex;
  width: 100%;
  justify-content: space-between;
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const InfoText = styled('span')`
  color: ${({ theme }) => theme.foreground};
  text-align: right;
  white-space: pre-wrap;
`

export const InfoSection = styled.div`
  margin: 1.5rem 0;
  background-color: ${({ theme }) =>
    chroma(theme.accent).brighten(1).alpha(0.1).hex()};

  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
`

const useMapInfoTagStatus = (status: InfoTagStatus) => {
  const theme = useTheme()

  if (status === 'warning') {
    return { backgroundColor: theme.lightWarning, color: theme.darkWarning }
  }

  if (status === 'danger') {
    return { backgroundColor: theme.lightDanger, color: theme.danger }
  }

  if (status === 'highlight') {
    return { backgroundColor: theme.highlight, color: theme.darkHighlight }
  }

  if (status === 'neutral') {
    return { backgroundColor: '#c7c7c7', color: '#777777' }
  }

  if (status === 'info') {
    return { backgroundColor: theme.accentLight, color: theme.accent }
  }

  return { backgroundColor: theme.lightSuccess, color: theme.success }
}

export type InfoTagStatus =
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'highlight'
  | 'neutral'

export const InfoTag = styled.div<{
  status?: InfoTagStatus
}>`
  background-color: ${({ status = 'success' }) =>
    useMapInfoTagStatus(status).backgroundColor};
  padding: 0 0.7em;
  color: ${({ status = 'success' }) => useMapInfoTagStatus(status).color};
  border-radius: 7px;
  font-size: 1rem;
  text-align: center;
  white-space: nowrap;
`
