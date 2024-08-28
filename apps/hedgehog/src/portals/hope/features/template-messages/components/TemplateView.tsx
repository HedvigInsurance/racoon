import * as React from 'react'
import styled from '@emotion/styled'
import { Trash } from 'react-bootstrap-icons'
import { TemplateForm } from './TemplateForm'
import { Template } from 'types/generated/graphql'

const Content = styled.div`
  position: relative;

  border: 1px solid ${({ theme }) => theme.border};
  padding: 1.25rem 1.5rem;
`

const DeleteWrapper = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 1rem;

  display: flex;
  align-items: center;

  cursor: pointer;

  & * {
    color: ${({ theme }) => theme.placeholderColor};
  }

  & span {
    margin-left: 0.5rem;
    font-size: 13px;
  }

  &:hover {
    & * {
      color: ${({ theme }) => theme.semiStrongForeground};
    }
  }
`

export const TemplateView: React.FC<{
  template: Template
  onEdit: (template: Template) => void
  onDelete: (id: string) => void
}> = ({ template, onEdit, onDelete }) => (
  <Content>
    {template && (
      <TemplateForm template={template} onEdit={onEdit} isCreating={false} />
    )}
    <DeleteWrapper onClick={() => template.id && onDelete(template.id)}>
      <Trash style={{ width: '1rem', height: '1rem' }} />
      <span>Delete</span>
    </DeleteWrapper>
  </Content>
)
