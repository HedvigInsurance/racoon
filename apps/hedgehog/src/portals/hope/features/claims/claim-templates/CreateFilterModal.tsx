import styled from '@emotion/styled'
import { Button, Input, Modal, ThirdLevelHeadline } from '@hedvig-ui'
import { ClaimFilterTemplate } from '@hope/features/claims/claim-templates/hooks/use-template-claims'
import { ClaimsFiltersType } from '@hope/pages/claims/list/ClaimsListPage'
import { useState } from 'react'
import * as React from 'react'
import { ClaimTemplateFilters } from '@hope/features/claims/claim-templates/components/ClaimTemplateFilters'

const ClaimFilters = styled(ClaimTemplateFilters)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 1em;
  row-gap: 1em;
`

const Body = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

interface CreateFilterProps {
  onClose: () => void
  editableTemplate?: ClaimFilterTemplate
  onSave: (filters: ClaimFilterTemplate) => void
  visible: boolean
}

export const CreateFilterModal: React.FC<CreateFilterProps> = ({
  editableTemplate,
  onSave,
  onClose,
  visible,
}) => {
  const [name, setName] = useState<string>(
    (editableTemplate && editableTemplate.name) || '',
  )
  const [template, setTemplate] = useState<ClaimsFiltersType>(
    editableTemplate || {
      filterClaimStates: null,
      filterCreatedBeforeOrOnDate: null,
      filterComplexities: null,
      filterMarkets: null,
      filterTypesOfContract: null,
      filterClaimOutcomes: null,
      filterClaimTypes: [],
    },
  )

  const createFilterHandler = () => {
    onSave({
      ...template,
      name,
      id: editableTemplate?.id ?? crypto.randomUUID(),
    })
    onClose()
  }

  return (
    <Modal
      onClose={onClose}
      style={{ padding: '1.5rem', width: 700 }}
      visible={visible}
    >
      <ThirdLevelHeadline>Create claim filter</ThirdLevelHeadline>
      <Body>
        <Input
          autoFocus
          placeholder="Template name"
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value)
          }}
        />

        <ClaimFilters template={template} editTemplate={setTemplate} />

        <Button onClick={createFilterHandler} style={{ position: 'relative' }}>
          {!editableTemplate ? 'Create' : 'Save'}
        </Button>
      </Body>
    </Modal>
  )
}
