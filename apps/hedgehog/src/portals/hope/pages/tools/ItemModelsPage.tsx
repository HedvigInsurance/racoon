import { useState } from 'react'
import {
  Flex,
  MainHeadline as _MainHeadLine,
  Tab,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import {
  AddItemModel,
  ItemModelBrandFilter,
  ItemModelList,
  ItemModelProvider,
  ItemModelTypeFilter,
  UploadItemModels,
} from '@hope/features/tools/item-models'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  padding: 2rem;
`

const Section = styled.section<{ maxW?: string }>`
  width: 100%;
  max-width: ${({ maxW }) => maxW ?? 'auto'};
`

const MainHeadline = styled(_MainHeadLine)`
  margin: 0;
`

const tabs = [
  {
    title: 'Models',
  },
  {
    title: 'Create',
  },
  {
    title: 'File upload',
  },
]

const ItemModelsPageInner = () => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].title)
  return (
    <Wrapper>
      <Flex direction="column" gap="medium">
        <MainHeadline>Item models</MainHeadline>
        <div style={{ display: 'flex' }}>
          {tabs.map((tab) => (
            <Tab
              key={tab.title}
              style={{ padding: '0.5rem 2rem' }}
              title={tab.title}
              action={() => setSelectedTab(tab.title)}
              active={tab.title === selectedTab}
            />
          ))}
        </div>
        {selectedTab === 'Models' && (
          <>
            <Section>
              <ItemModelTypeFilter />
            </Section>
            <Section>
              <ItemModelBrandFilter />
            </Section>
            <Section>
              <ItemModelList />
            </Section>
          </>
        )}
        {selectedTab === 'Create' && (
          <Section maxW="400px">
            <ThirdLevelHeadline>Add item model</ThirdLevelHeadline>
            <AddItemModel />
          </Section>
        )}
        {selectedTab === 'File upload' && (
          <Section>
            <ThirdLevelHeadline>Upload from file</ThirdLevelHeadline>
            <UploadItemModels />
          </Section>
        )}
      </Flex>
    </Wrapper>
  )
}

const ItemModelsPage = () => (
  <ItemModelProvider>
    <ItemModelsPageInner />
  </ItemModelProvider>
)

export default ItemModelsPage
