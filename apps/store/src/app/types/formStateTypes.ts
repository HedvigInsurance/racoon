export type FieldsErrors = Record<string, string>
export type GenericErrors = Array<string>
export type Message = {
  type: 'success' | 'info' | 'warning'
  content: string
}

export type FormStateWithErrors =
  | undefined
  | null
  | {
      fields?: Record<string, string>
      errors?: {
        fields?: FieldsErrors
        generic?: GenericErrors
      }
      messages?: Array<Message>
    }
