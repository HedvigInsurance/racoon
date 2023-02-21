import styled from '@emotion/styled'
import React from 'react'
import Balancer from 'react-wrap-balancer'
import { HeadingLabel, Text, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'

type InsurableLimit = {
  label: string
  description: string
  value: string
}

type InsurableLimitsProps = {
  items: Array<InsurableLimit>
}

const Grid = styled(GridLayout.Root)({
  gap: `${theme.space.xxl} ${theme.space.md}`,
})

const getColumns = (items: InsurableLimit[]) => {
  const noOfItems = items.length
  if (noOfItems > 4 || noOfItems === 3) return '1/3'
  return '1/2'
}

export const InsurableLimits = ({ items }: InsurableLimitsProps) => {
  const columns = getColumns(items)
  return (
    <Grid>
      {items.map((item) => (
        <GridLayout.Content width={columns} align="left" key={item.label}>
          <HeadingLabel as="h3" mb={theme.space.md}>
            {item.label}
          </HeadingLabel>
          <Text size="xl">{item.value}</Text>
          <Balancer ratio={0.6}>
            <Text size="xl" color="textSecondary">
              {item.description}
            </Text>
          </Balancer>
        </GridLayout.Content>
      ))}
    </Grid>
  )
}
