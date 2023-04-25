import { InputField } from './Field.types'

export type Form = {
  sections: Array<FormSection>
}

export type FormSection = TemplateSection & {
  state: 'initial' | 'valid'
}

export type SectionItem = {
  field: InputField
  layout: SectionItemLayout
}

type SectionItemLayout = {
  columnSpan: number
}

type Placeholder = { key: string; pattern: string }

export type Label = {
  key: string
  placeholders?: Array<Placeholder>
}

export type Template = {
  name: string
  sections: Array<TemplateSection>
}

export type TemplateSection = {
  id: string
  title: Label
  submitLabel: Label
  items: Array<SectionItem>
  preview?: {
    fieldName: string
    label?: Label
  }
}

export type JSONData = Record<string, JSONValue>

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [x: string]: JSONValue }
  | Array<JSONValue>
