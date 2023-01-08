import styled from '@emotion/styled'
import React, { useState, useCallback, ReactNode } from 'react'
import { mq } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { CoverageList } from './CoverageList'
import { Peril } from './Perils.types'

const MAX_COLS = 4

type Props = {
  items: Array<Peril>
}

export const Perils = ({ items }: Props) => {
  const numberOfItemsPerColumn = Math.ceil(items.length / MAX_COLS)
  const accordions: Array<ReactNode> = []
  for (let i = 0; i < items.length; i += numberOfItemsPerColumn) {
    const perils = items.slice(i, i + numberOfItemsPerColumn)
    accordions.push(<PerilsAccordion key={i} perils={perils} />)
  }

  return <PerilsAccordionGrid fixedCols={items.length < 4}>{accordions}</PerilsAccordionGrid>
}

const PerilsAccordionGrid = styled.div(({ fixedCols = false }: { fixedCols?: boolean }) => ({
  display: 'grid',
  gap: '0.25rem',
  [mq.md]: {
    gridTemplateColumns: `repeat(auto-fit, ${fixedCols ? '20.75rem' : 'minmax(20.75rem, 1fr)'})`,
    gap: '1rem',
  },
}))

const PerilsAccordion = ({ perils }: { perils: Array<Peril> }) => {
  const [openedItems, setOpenedItems] = useState<Array<string>>()

  const handleValueChange = useCallback((value: Array<string>) => {
    setOpenedItems(value)
  }, [])

  console.log(perils)

  return (
    <Accordion.Root type="multiple" value={openedItems} onValueChange={handleValueChange}>
      {perils.map(({ icon, title, description, covered, exceptions }) => {
        return (
          <Accordion.Item key={title} value={title}>
            <Accordion.HeaderWithTrigger>
              <SpaceFlex space={0.5}>
                {icon}
                {title}
              </SpaceFlex>
            </Accordion.HeaderWithTrigger>
            <Accordion.Content>
              <ContentWrapper>
                <p>{description}</p>
                <CoverageList variant="covered" heading="Covered" items={covered} />
                <CoverageList variant="not-covered" heading="Not Covered" items={exceptions} />
              </ContentWrapper>
            </Accordion.Content>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}

const ContentWrapper = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[4],
  paddingLeft: theme.space[6],
  paddingBottom: theme.space[4],
  fontSize: theme.fontSizes[1],
  color: theme.colors.gray700,
}))
