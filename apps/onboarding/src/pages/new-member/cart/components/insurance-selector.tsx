import styled from '@emotion/styled'
import { useState } from 'react'
import { Heading, Space } from 'ui'
import { Price } from '../types'
import { MonthlyPrice } from './monthly-price'

const Wrapper = styled.div({
  width: '100%',
  padding: '1.25rem 1rem',
})

const InfoRow = styled(Space)({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.5rem',
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

const Box = styled(Space)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  border: `1px solid ${theme.colors.gray500}`,
  cursor: 'pointer',
  padding: '1.125rem 1rem 1rem 0.5rem',
  borderRadius: '0.5rem',
  boxSizing: 'border-box',

  ':focus, :hover': {
    outline: '2px solid transparent',
    outlineOffset: '2px',
    borderColor: theme.colors.gray900,
  },

  '&.active': {
    border: `2px solid ${theme.colors.gray900}`,
    paddingTop: 'calc(1.125rem - 1px)',
    paddingBottom: 'calc(1rem - 1px)',
    paddingLeft: 'calc(0.5rem - 1px)',
    paddingRight: 'calc(1rem - 1px)',
  },
}))

export type InsuranceSelectorOption = {
  id: string
  displayName: string
  price: Price
  description?: string
  selected: boolean
}

type InsuranceSelectorProps = {
  options: Array<InsuranceSelectorOption>
}

export const InsuranceSelector = ({ options }: InsuranceSelectorProps) => {
  const [selected, setSelected] = useState(() => {
    const selectedItem = options.find((item) => item.selected)
    return selectedItem ? selectedItem.id : options[0].id
  })

  return (
    <Wrapper>
      <Space y={1}>
        <Heading headingLevel="h3" variant="xs" colorVariant="dark">
          Select your insurance package
        </Heading>
        <Space y={1.5}>
          {options.map((option) => (
            <Box
              key={option.id}
              x={1}
              className={selected === option.id ? 'active' : ''}
              onClick={() => setSelected(option.id)}
            >
              <InfoRow>
                <Title>{option.displayName}</Title>
                <MonthlyPrice price={option.price} />
              </InfoRow>
              <Description>{option.description}</Description>
            </Box>
          ))}
        </Space>
      </Space>
    </Wrapper>
  )
}
