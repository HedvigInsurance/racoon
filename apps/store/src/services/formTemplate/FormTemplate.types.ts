type Placeholder = { key: string; pattern: string }
export type TextLabel = { key: string; placeholders?: Array<Placeholder> }

export type FormTemplateUISchema = {
  layout: Layout
  fields: Record<string, FieldConfig | undefined>
}

type FieldConfig = {
  title?: TextLabel
  type?: FormTemplateField['type']

  required?: boolean
  defaultValue?: string

  options?: Array<FieldOption>
}

type FieldOption = { label: TextLabel; value: string }

type Layout = {
  sections: Array<LayoutSection>
}

type LayoutSection = {
  id: string
  title: TextLabel
  fields: Array<LayoutField>
  submit: TextLabel
}

type LayoutField = {
  name: string
  columnSpan?: number
}

export type FormTemplate = {
  sections: Array<FormSection>
}

export type FormSection = {
  id: string
  title: TextLabel
  submit: TextLabel
  fields: Array<FormTemplateField>

  state: InputGroupState
}

type InputGroupState = 'INITIAL' | 'INVALID' | 'VALID'

export type FormTemplateField =
  | TextField
  | NumberField
  | SelectField
  | DateField
  | RadioField
  | HiddenField

type FieldBase = LayoutField & {
  label?: TextLabel
  placeholder?: TextLabel
  defaultValue?: string
  required?: boolean
}

type TextField = FieldBase & { type: 'text'; pattern?: string }
type NumberField = FieldBase & { type: 'number'; min?: number; max?: number }
type SelectField = FieldBase & { type: 'select'; options: Array<FieldOption> }
type DateField = FieldBase & { type: 'date' }
type RadioField = FieldBase & { type: 'radio'; options: Array<FieldOption> }
type HiddenField = FieldBase & { type: 'hidden' }
