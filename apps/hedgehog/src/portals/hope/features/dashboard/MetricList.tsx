import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { useHasPermission } from '@hope/common/hooks/use-has-permission'

const MetricsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const metricStyles = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  color: ${theme.accentContrast} !important;
  background: ${theme.accent};
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  min-width: 200px;
  position: relative;

  &:hover,
  &:focus {
    opacity: 0.8;
    color: ${theme.accentContrast} !important;
  }
`

const Metric = styled(Link)`
  ${({ theme }) => metricStyles(theme)}
`

export const MetricNumber = styled.span`
  display: block;
  font-size: 2rem;
  padding-bottom: 0.25rem;
`
export const MetricName = styled.span`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.66;
`

interface MetricListProps {
  numberOfClaims: number
  numberOfTasks: number
}

export const MetricList: React.FC<MetricListProps> = ({
  numberOfClaims,
  numberOfTasks,
}) => {
  const { hasPermission: hasInboxPermission, loading } =
    useHasPermission('navigateInbox')

  interface MetricListType {
    name: string
    number?: number
    link: string
  }

  const metricsList: MetricListType[] = [
    {
      name: 'claims',
      number: numberOfClaims,
      link: '/claims/list/1',
    },
    {
      name: 'inbox',
      number: numberOfTasks,
      link: '/inbox',
    },
  ].filter((item) => {
    if (item.name === 'inbox') return hasInboxPermission

    return true
  })

  if (loading) {
    return null
  }

  return (
    <>
      <MetricsWrapper>
        {metricsList.map((metric) => {
          return (
            <React.Fragment key={metric.name}>
              <Metric to={metric.link}>
                <MetricNumber>{metric.number}</MetricNumber>
                <MetricName>{metric.name}</MetricName>
              </Metric>
            </React.Fragment>
          )
        })}
      </MetricsWrapper>
    </>
  )
}
