import { InputField, NumberField } from './Field.types'

export const getIntegerField = (field: Omit<NumberField, 'type' | 'deserialize'>): NumberField => ({
  ...field,
  type: 'number',
  deserialize: (value) => parseInt(value, 10),
})

export const deserializeField = (field: InputField, value: string) => {
  return field.deserialize?.(value) ?? value
}
