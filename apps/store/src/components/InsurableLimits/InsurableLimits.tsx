import styled from '@emotion/styled'
import { Statistic } from '../Statistic/Statistic'

const Wrapper = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.space[2],
  // fit as many columns as possible in the container without the width subceeding 200px
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
}))

type InsurableLimit = {
  value: string
  label: string
}

type InsurableLimitsProps = {
  limits: InsurableLimit[]
}

export const InsurableLimits = ({ limits }: InsurableLimitsProps) => {
  return (
    <Wrapper>
      {limits.map((limit) => (
        <Statistic key={limit.label} label={limit.label} value={limit.value} />
      ))}
    </Wrapper>
  )
}
