import styled from '@emotion/styled'
import { useConfirmDialog } from '@hedvig-ui'
import { CreateFilterModal } from '@hope/features/claims/claim-templates/CreateFilterModal'
import { ClaimFilterTemplate } from '@hope/features/claims/claim-templates/hooks/use-template-claims'
import { useListClaims } from '@hope/features/claims/claims-list/graphql/use-list-claims'
import { HTMLAttributes, useEffect, useState } from 'react'
import * as React from 'react'
import { Files, Pencil, Trash } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'
import {
  MetricName,
  MetricNumber,
  metricStyles,
} from '@hope/features/dashboard/MetricList'

const IconsWrapper = styled.div`
  position: absolute;
  top: 0.5em;
  right: 0.5em;

  display: flex;
  align-items: center;
`

const Icon = styled.div`
  &:not(:last-child) {
    margin-right: 0.5em;
  }

  &:hover {
    opacity: 0.8;
  }
`

const Metric = styled.div`
  position: relative;
  cursor: pointer;
  max-width: 200px;
  transition: none;
  ${({ theme }) => metricStyles(theme)};
`

interface FilteredMetricProps extends HTMLAttributes<HTMLDivElement> {
  template: ClaimFilterTemplate
  onRemove: (id: string) => void
  onCreate: (filter: ClaimFilterTemplate) => void
  onEdit: (filter: ClaimFilterTemplate) => void
}

export const FilteredMetric: React.FC<FilteredMetricProps> = ({
  template,
  onRemove,
  onCreate,
  onEdit,
  children,
  ...props
}) => {
  const navigate = useNavigate()
  const [edit, setEdit] = useState(false)
  const [hover, setHover] = useState(false)

  const [{ totalClaims }, listClaims] = useListClaims()
  const { confirm } = useConfirmDialog()

  const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.currentTarget !== e.target) {
      return
    }

    navigate(`/claims/list/1?template=${template.id}`)
  }

  useEffect(() => {
    listClaims({
      ...template,
    })
  }, [template, listClaims])

  const deleteHandler = () => {
    confirm(`Are you sure you want to delete ${template.name}?`).then(() => {
      onRemove(template.id)
    })
  }

  return (
    <Metric
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={clickHandler}
      {...props}
    >
      <MetricNumber onClick={clickHandler}>{totalClaims || 0}</MetricNumber>
      <MetricName onClick={clickHandler} title={template.name}>
        {template.name}
      </MetricName>
      {hover && (
        <IconsWrapper>
          <Icon
            title="Edit"
            onClick={() => {
              setEdit(true)
            }}
          >
            <Pencil />
          </Icon>
          <Icon
            title="Duplicate"
            onClick={() => {
              onCreate({
                ...template,
                name: `${template.name} copy`,
                id: crypto.randomUUID(),
              })
            }}
          >
            <Files />
          </Icon>
          <Icon title="Delete" onClick={deleteHandler}>
            <Trash />
          </Icon>
        </IconsWrapper>
      )}
      <CreateFilterModal
        visible={edit}
        onClose={() => setEdit(false)}
        editableTemplate={template}
        onSave={onEdit}
      />
      {children}
    </Metric>
  )
}
