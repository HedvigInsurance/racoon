import { useMemo, useState } from 'react'
import * as React from 'react'
import { Button, Input, Label, SelectOrInput } from '@hedvig-ui'
import styled from '@emotion/styled'
import {
  getBrandsFromTypes,
  useItemModels,
} from '@hope/features/tools/item-models/useItemModels'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FormContent = styled.div`
  width: 100%;
`

export const AddItemModel = () => {
  const { itemModelTypes, itemModelBrands, addModel } = useItemModels()
  const [formValues, setFormValues] = useState({
    name: '',
    type: '',
    brand: '',
  })

  const selectedType = itemModelTypes.find(
    (type) => type.name === formValues.type,
  )
  const possibleBrands = selectedType
    ? getBrandsFromTypes([selectedType])
    : itemModelBrands

  const handleFormChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const isFormReadyForSubmit = useMemo(
    () =>
      !!formValues.type &&
      !!formValues.brand &&
      !!formValues.name &&
      !!formValues.name.trim(),
    [formValues],
  )

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormReadyForSubmit) {
      return
    }
    await addModel(formValues)
  }

  return (
    <Form onSubmit={handleSubmitForm}>
      <FormContent>
        <Label>Type</Label>
        <SelectOrInput
          value={formValues.type}
          options={itemModelTypes.map(({ name, displayName }) => ({
            name: displayName,
            value: name,
          }))}
          onChange={(value: string) => handleFormChange('type', value)}
        />
      </FormContent>
      <FormContent>
        <Label>Brand</Label>
        <SelectOrInput
          value={formValues.brand}
          options={possibleBrands.map(({ name, displayName }) => ({
            name: displayName,
            value: name,
          }))}
          onChange={(value: string) => handleFormChange('brand', value)}
        />
      </FormContent>
      <FormContent>
        <Label>Model name</Label>
        <Input
          placeholder="Name of the model"
          value={formValues.name}
          onChange={(e) => handleFormChange('name', e.target.value)}
        />
      </FormContent>
      <Button
        style={{ width: 'max-content' }}
        type="submit"
        disabled={!isFormReadyForSubmit}
      >
        Add model
      </Button>
    </Form>
  )
}
