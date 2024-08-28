import styled from '@emotion/styled'
import { FadeIn, Spacing, useTitle } from '@hedvig-ui'
import { Greeting } from '@hope/features/dashboard/Greeting'
import { useMe } from '@hope/features/user/hooks/use-me'
import gql from 'graphql-tag'
import { MetricList } from '../features/dashboard/MetricList'
import * as React from 'react'
import { useGetDashboardDataQuery } from 'types/generated/graphql'
import { TasksData } from '@hope/features/dashboard/TasksData'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
`

gql`
  query GetDashboardData {
    dashboardNumbers {
      numberOfClaims
    }
    tasks {
      ...TaskDashboardData
    }
  }

  fragment TaskDashboardData on Task {
    id
    market
    area
    resourceType
    createdAt
    assignedTo
    warmth
  }
`

const DashboardPage: React.FC = () => {
  const { data } = useGetDashboardDataQuery({
    pollInterval: 1000 * 60,
  })

  const { me } = useMe()

  useTitle('Dashboard')

  const tasks = data?.tasks ?? []

  return (
    <Wrapper>
      <Spacing bottom>
        <Greeting userName={me.fullName.split(' ')[0]} />
      </Spacing>
      <FadeIn>
        <MetricList
          numberOfClaims={data?.dashboardNumbers?.numberOfClaims ?? 0}
          numberOfTasks={tasks.length}
        />
        <TasksData tasks={tasks} />
      </FadeIn>
    </Wrapper>
  )
}

export default DashboardPage
