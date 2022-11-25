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
  initialData?: JSONData
  sections: Array<TemplateSection>
}

type TemplateSection = {
  id: string
  title: Label
  submitLabel: Label
  items: Array<SectionItem>
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
