import { useInsecurePersistentState } from '@hedvig-ui'
import { ClaimsFiltersType } from '@hope/pages/claims/list/ClaimsListPage'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export interface ClaimFilterTemplate extends ClaimsFiltersType {
  id: string
  name: string
}

interface UseTemplateClaimsResult {
  templateActive: boolean
  selectedTemplate?: string
  localFilter: ClaimsFiltersType
  templateFilters: ClaimFilterTemplate[]
  selectTemplate: (templateId: string) => void
  createTemplate: (template: ClaimFilterTemplate) => void
  editTemplate: (template: ClaimsFiltersType, id?: string) => void
  editTemplateWithName: (template: ClaimFilterTemplate) => void
  removeTemplate: (templateId: string) => void
}

export const useTemplateClaims = (
  selectedId?: string | null,
): UseTemplateClaimsResult => {
  const [templateActive, setTemplateActive] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>()
  const [localFilter, setLocalFilter] = useState<ClaimsFiltersType>({
    filterClaimStates: null,
    filterCreatedBeforeOrOnDate: null,
    filterComplexities: null,
    filterMarkets: null,
    filterTypesOfContract: null,
    filterClaimOutcomes: null,
    filterClaimTypes: [],
  })

  const [templateFilters, setTemplateFilters] = useInsecurePersistentState<
    ClaimFilterTemplate[]
  >('claims:templates', [])

  const navigate = useNavigate()

  useEffect(() => {
    if (!selectedId) {
      setTemplateActive(false)
      return
    }

    const filter = {
      ...templateFilters.filter((template) => template.id === selectedId)[0],
    }

    if (filter) {
      setLocalFilter(filter)
      setTemplateActive(true)
      setSelectedTemplate(selectedId)
    }
  }, [selectedId, templateFilters])

  const selectTemplate = (templateId: string) => {
    if (templateId === selectedTemplate) {
      setSelectedTemplate(undefined)
      navigate(`/claims/list/1`)
      return
    }

    navigate(`/claims/list/1?template=${templateId}`)
  }

  const createTemplate = (template: ClaimFilterTemplate) => {
    setTemplateFilters((prev) => [
      ...prev,
      {
        ...template,
        name: template.name
          ? template.name
          : `Claims Template ${templateFilters.length + 1}`,
      },
    ])
  }

  const editTemplate = (newTemplate: ClaimsFiltersType, id?: string) => {
    setLocalFilter(newTemplate)
    setTemplateFilters((prev) =>
      prev.map((template) =>
        template.id !== id
          ? template
          : { ...newTemplate, name: template.name, id },
      ),
    )
  }

  const editTemplateWithName = (newTemplate: ClaimFilterTemplate) => {
    setTemplateFilters((prev) =>
      prev.map((template) =>
        template.id !== newTemplate.id ? template : newTemplate,
      ),
    )
  }

  const removeTemplate = (templateId: string) => {
    const newTemplates = templateFilters.filter(
      (template) => template.id !== templateId,
    )
    setTemplateFilters(newTemplates)
  }

  return {
    templateActive,
    selectedTemplate,
    localFilter,
    templateFilters,
    selectTemplate,
    createTemplate,
    editTemplate,
    editTemplateWithName,
    removeTemplate,
  }
}
