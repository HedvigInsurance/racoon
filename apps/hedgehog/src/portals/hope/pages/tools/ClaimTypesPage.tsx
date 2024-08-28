import styled from '@emotion/styled'
import {
  FadeIn,
  Flex,
  Input,
  MainHeadline,
  SecondLevelHeadline,
  Spacing,
  Tabs,
  useTitle,
} from '@hedvig-ui'
import { CreateOptionForm } from '@hope/features/tools/claim-types/forms/CreateOptionForm'
import { CreatePropertyForm } from '@hope/features/tools/claim-types/forms/CreatePropertyForm'
import { CreateRelationForm } from '@hope/features/tools/claim-types/forms/CreateRelationForm'
import { OptionsTable } from '@hope/features/tools/claim-types/tables/OptionsTable'
import { PropertiesTable } from '@hope/features/tools/claim-types/tables/PropertiesTable'
import { RelationsTable } from '@hope/features/tools/claim-types/tables/RelationsTable'
import { TypesTable } from '@hope/features/tools/claim-types/tables/TypesTable'
import { useState } from 'react'
import * as React from 'react'

const Wrapper = styled.div`
  padding: 2rem;
`

const ClaimTypesPage: React.FC = () => {
  const [tab, setTab] = useState<
    'bindings' | 'properties' | 'options' | 'relations'
  >('bindings')
  const [filter, setFilter] = useState('')

  useTitle('Tools | Claim Types')

  return (
    <Wrapper>
      <MainHeadline>Claim Types</MainHeadline>
      <Spacing top={'medium'} />
      <Flex direction="row">
        <Flex direction="column" flex="2" align="center">
          <Flex align="center" justify="space-between">
            <Tabs
              style={{ maxWidth: 380 }}
              list={[
                {
                  title: 'Bindings',
                  action: () => setTab('bindings'),
                  active: tab === 'bindings',
                },
                {
                  title: 'Properties',
                  action: () => setTab('properties'),
                  active: tab === 'properties',
                },
                {
                  title: 'Options',
                  action: () => setTab('options'),
                  active: tab === 'options',
                },
                {
                  title: 'Relations',
                  action: () => setTab('relations'),
                  active: tab === 'relations',
                },
              ]}
            />
            <Input
              size="small"
              value={filter}
              placeholder="Your filter goes here"
              onChange={(e) => setFilter(e.currentTarget.value)}
              style={{ width: '200px', marginLeft: 'auto' }}
            />
          </Flex>
          <Spacing top />
          {tab === 'bindings' && (
            <FadeIn style={{ width: '100%' }}>
              <TypesTable filter={filter} />
            </FadeIn>
          )}
          {tab === 'properties' && (
            <FadeIn style={{ width: '100%' }}>
              <PropertiesTable filter={filter} />
            </FadeIn>
          )}
          {tab === 'options' && (
            <FadeIn style={{ width: '100%' }}>
              <OptionsTable filter={filter} />
            </FadeIn>
          )}
          {tab === 'relations' && (
            <FadeIn style={{ width: '100%' }}>
              <RelationsTable filter={filter} />
            </FadeIn>
          )}
        </Flex>

        {tab === 'properties' || tab === 'options' || tab === 'relations' ? (
          <Flex
            flex="1"
            direction="column"
            style={{
              marginLeft: '1em',
            }}
          >
            {tab === 'properties' && (
              <div style={{ marginTop: '5rem', width: '100%' }}>
                <SecondLevelHeadline>Create property</SecondLevelHeadline>
                <CreatePropertyForm />
              </div>
            )}
            {tab === 'options' && (
              <div style={{ marginTop: '5rem', width: '100%' }}>
                <SecondLevelHeadline>Create option</SecondLevelHeadline>
                <CreateOptionForm />
              </div>
            )}
            {tab === 'relations' && (
              <div style={{ marginTop: '5rem', width: '100%' }}>
                <SecondLevelHeadline>Create relation</SecondLevelHeadline>
                <CreateRelationForm />
              </div>
            )}
          </Flex>
        ) : null}
      </Flex>
    </Wrapper>
  )
}

export default ClaimTypesPage
