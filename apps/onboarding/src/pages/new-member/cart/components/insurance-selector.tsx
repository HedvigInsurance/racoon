import { Heading, Space } from 'ui'

import Image from 'next/image'
import styled from '@emotion/styled'
import { useState } from 'react'

const Wrapper = styled.div({
  width: '100%',
  padding: '0.75rem 1rem',
})

const InfoRow = styled(Space)({
  display: 'flex',
  justifyContent: 'space-between',
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
  fontSize: '1rem',
  lineHeight: '1.4',
  color: theme.colors.gray900,
  margin: 0,
}))

const Box = styled(Space)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  border: `1px solid ${theme.colors.gray500}`,
  cursor: 'pointer',
  padding: '1.125rem 1rem 1rem 0.5rem',
  borderRadius: '0.5rem',

  ':focus, :hover': {
    outline: '2px solid transparent',
    outlineOffset: '2px',
    borderColor: theme.colors.gray900,
  },

  '&.active': {
    border: `2px solid ${theme.colors.gray900}`,
  },
}))

export const InsuranceSelector = () => {
  const [selected, setSelected] = useState(0)

  return (
    <Wrapper>
      <Space y={1}>
        <Heading headingLevel="h3" variant="s" colorVariant="dark">
          Choose your insurance
        </Heading>
        <Space y={1.5}>
          <Box x={1} className={selected === 0 ? 'active' : ''} onClick={() => setSelected(0)}>
            <InfoRow>
              <Title>Home owners + Accident </Title>
              <MonthlyPrice>239 kr/mo </MonthlyPrice>
            </InfoRow>
            <Description> 10% discount included </Description>
          </Box>

          <Box x={1} className={selected === 1 ? 'active' : ''} onClick={() => setSelected(1)}>
            <InfoRow>
              <Title>Home owners </Title>
              <MonthlyPrice>179 kr/mo </MonthlyPrice>
            </InfoRow>
            <Description> 179 kr/mo </Description>
          </Box>
        </Space>
      </Space>
    </Wrapper>
  )
}
