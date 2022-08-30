import styled from '@emotion/styled'

const Wrapper = styled.div(({ theme }) => ({
  display: 'grid',
  gap: theme.space[2],
  // fit as many columns as possible in the container without the width subceeding 200px
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
}))

type InsurableLimitsProps = {
  children: React.ReactNode
  className?: string
}

export const InsurableLimits = ({ children, className }: InsurableLimitsProps) => {
  return <Wrapper className={className}>{children}</Wrapper>
}
