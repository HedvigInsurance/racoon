import styled from '@emotion/styled'

export type StatisticProps = {
  value: string
  label: string
}

const Wrapper = styled.div(({ theme }) => ({
  padding: theme.space[4],
  paddingTop: theme.space[2],
  borderRadius: theme.space[2],
  border: `1px solid ${theme.colors.gray600}`,
  backgroundColor: theme.colors.gray300,
  minHeight: theme.space[9],
  display: 'grid',
  justifyItems: 'start',
}))

const Label = styled.p(({ theme }) => ({
  color: theme.colors.gray600,
  fontSize: theme.fontSizes[1],
}))

const Value = styled.p(({ theme }) => ({
  color: theme.colors.black,
  fontSize: theme.fontSizes[4],
}))

export const Statistic = ({ label, value }: StatisticProps) => {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Wrapper>
  )
}
