import styled from '@emotion/styled'
import {
  Button,
  FadeIn,
  Flex,
  MainHeadline,
  Tabs,
  useConfirmDialog,
} from '@hedvig-ui'
import {
  uniquePickedLocales,
  useTemplateMessages,
} from '@hope/features/template-messages/use-template-messages'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { Template, UpsertTemplateInput } from 'types/generated/graphql'
import { PickedLocaleMarket } from '../../features/config/constants'
import { CreateTemplate } from '../../features/template-messages/components/CreateTemplate'
import { SearchTemplate } from '../../features/template-messages/components/SearchTemplate'
import { TemplateView } from '../../features/template-messages/components/TemplateView'

const Wrapper = styled(FadeIn)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
`

const Content = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 25% 1fr;
  column-gap: 2rem;
  margin-top: 2rem;
`

const TemplateMessagesPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  )

  const {
    templates,
    create: createTemplate,
    edit: editTemplate,
    delete: deleteTemplate,
    locale: currentLocale,
    setLocale: changeCurrentLocale,
  } = useTemplateMessages()

  useEffect(() => {
    setSelectedTemplate((selectedTemplate) => {
      if (selectedTemplate) {
        return (
          templates.find((template) => template.id === selectedTemplate.id) ||
          null
        )
      }
      return selectedTemplate
    })
  }, [templates])

  const { confirm } = useConfirmDialog()

  const saveChangesHandler = (newTemplate: Template) => {
    if (!selectedTemplate) {
      return
    }

    editTemplate(newTemplate)
  }

  const createHandler = (newTemplate: UpsertTemplateInput) => {
    createTemplate(newTemplate, () => setIsCreating(false))
  }

  const deleteHandler = (id: string) => {
    confirm('Are you sure you want to delete this message template?').then(
      () => {
        deleteTemplate(id)
        setSelectedTemplate(null)
      },
    )
  }

  if (isCreating) {
    return (
      <Wrapper>
        <MainHeadline style={{ marginBottom: '2rem' }}>
          📋 Create New Template
        </MainHeadline>
        <CreateTemplate
          onClose={() => setIsCreating(false)}
          onCreate={createHandler}
        />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <MainHeadline style={{ marginBottom: '2rem' }}>
        📋 Template Messages
      </MainHeadline>
      <Flex flex="0" align="center" justify="space-between">
        <Tabs
          style={{ width: '30%' }}
          list={uniquePickedLocales.map((locale) => ({
            active: currentLocale === locale,
            title:
              PickedLocaleMarket[locale].charAt(0) +
              PickedLocaleMarket[locale].toLowerCase().slice(1),
            action: () => {
              setSelectedTemplate(null)
              changeCurrentLocale(locale)
            },
          }))}
        />
        <Button onClick={() => setIsCreating(true)}>Create New Template</Button>
      </Flex>
      <Content>
        <SearchTemplate
          selected={selectedTemplate}
          onSelect={setSelectedTemplate}
          templates={templates}
        />
        {selectedTemplate && (
          <TemplateView
            template={selectedTemplate}
            onEdit={saveChangesHandler}
            onDelete={deleteHandler}
          />
        )}
      </Content>
    </Wrapper>
  )
}

export default TemplateMessagesPage
