import { Heading, Space } from 'ui'

import Image from 'next/image'
import styled from '@emotion/styled'

const Wrapper = styled.div({
  width: '100%',
  padding: '0.75rem 1rem',
})

const InfoRow = styled(Space)({
  display: 'flex',
})

const Title = styled.p(({ theme }) => ({
  color: theme.colors.gray900,
  fontSize: '1rem',
  lineHeight: '1.4',
  margin: '0 0 0 1rem',
}))

const Description = styled.p(({ theme }) => ({
  fontSize: '0.875rem',
  lineHeight: '1.4',
  color: theme.colors.gray700,
  margin: 0,
}))

const MonthlyPrice = styled.p(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.colors.gray900,
  margin: 0,
}))

const Card = styled(Space)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  border: '1px solid',
  borderColor: theme.colors.gray300,
  boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.05)',
  padding: '1.5rem',
  borderRadius: '0.625rem',
}))

export const Picker = () => {
  return (
    <Wrapper>
      <Heading headingLevel="h3" variant="s" colorVariant="dark">
        Choose your insurance
      </Heading>

      <Space y={1.5}>
        <Card x={1}>
          <InfoRow>
            <Title>Home owners + Accident </Title>
            <MonthlyPrice>239 kr/mo </MonthlyPrice>
          </InfoRow>
          <Description> 10% discount included </Description>
        </Card>

        <Card x={1}>
          <InfoRow>
            <Title>Home owners </Title>
            <MonthlyPrice>179 kr/mo </MonthlyPrice>
          </InfoRow>
          <Description> 179 kr/mo </Description>
        </Card>
      </Space>
    </Wrapper>
  )
}
