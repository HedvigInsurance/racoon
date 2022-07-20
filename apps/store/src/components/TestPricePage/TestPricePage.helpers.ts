import { FormTemplate, FormSection } from '@/services/formTemplate/FormTemplate.types'

export const prepopulateFormTemplate = (
  template: FormTemplate,
  data: Record<string, unknown>,
): FormTemplate => {
  return {
    sections: template.sections.map((section) => {
      const newSection: FormSection = {
        ...section,
        fields: section.fields.map((field) => ({
          ...field,
          defaultValue: data[field.name] ?? field.defaultValue ?? '',
        })),
        state: 'INITIAL',
      }

      const allRequiredFieldsAreValid = newSection.fields
        .filter((field) => field.required)
        .every((field) => data[field.name])

      if (allRequiredFieldsAreValid) newSection.state = 'VALID'

      return newSection
    }),
  }
}
