import styled from '@emotion/styled'
import React, { useState } from 'react'
import { CrossIcon } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { CheckIcon } from './CheckIcon'
import { MinusIcon } from './MinusIcon'
import { PlusIcon } from './PlusIcon'

type Peril = {
  icon: React.ReactNode
  name: string
  description: string
  covered: Array<string>
  notCovered: Array<string>
}

type PerilsProps = {
  perils: Array<Peril>
}

export const Perils = ({ perils }: PerilsProps) => {
  const [openedItems, setOpenedItems] = useState<Array<string>>()

  return (
    <Accordion.Root
      type="multiple"
      value={openedItems}
      onValueChange={(value) => {
        setOpenedItems(value)
      }}
    >
      {perils.map(({ icon, name, description, covered, notCovered }) => {
        const isOpened = openedItems?.includes(name)

        return (
          <Accordion.Item key={name} value={name}>
            <Accordion.HeaderWithTrigger icon={isOpened ? <MinusIcon /> : <PlusIcon />}>
              <SpaceFlex space={0.5}>
                {icon}
                {name}
              </SpaceFlex>
            </Accordion.HeaderWithTrigger>
            <Accordion.Content>
              <ContentWrapper>
                <p>{description}</p>
                {covered.length > 0 && (
                  <CoverageListWrapper>
                    <CoverageListHeading>Covered</CoverageListHeading>
                    <CoverageList>
                      {covered.map((itemCovered, index) => (
                        <CoverageListItem key={`${itemCovered}-${index}`}>
                          <CheckIcon color="currentColor" size="10px" />
                          {itemCovered}
                        </CoverageListItem>
                      ))}
                    </CoverageList>
                  </CoverageListWrapper>
                )}
                {notCovered.length > 0 && (
                  <CoverageListWrapper>
                    <CoverageListHeading>Not covered</CoverageListHeading>
                    <CoverageList>
                      {covered.map((itemCovered, index) => (
                        <CoverageListItem key={`${itemCovered}-${index}`}>
                          <CrossIcon color="currentColor" size="10px" />
                          {itemCovered}
                        </CoverageListItem>
                      ))}
                    </CoverageList>
                  </CoverageListWrapper>
                )}
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

const CoverageListWrapper = styled.section(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[1],
}))

const CoverageListHeading = styled.h3({
  fontWeight: 'bold',
})

const CoverageList = styled.ul(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[1],
}))

const CoverageListItem = styled.li(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space[2],
}))
