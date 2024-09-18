import styled from '@emotion/styled'
import React from 'react'
import { Badge, Text, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { badge } from './InsurableLimits.css'

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

const getColumns = (items: Array<InsurableLimit>) => {
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
          <Badge className={badge} as="h3">
            {item.label}
          </Badge>
          <Text size="xl">{item.value}</Text>
          <Text size="xl" color="textSecondary" balance={true}>
            {item.description}
          </Text>
        </GridLayout.Content>
      ))}
    </Grid>
  )
}
