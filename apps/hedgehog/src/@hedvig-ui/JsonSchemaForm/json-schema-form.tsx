'use client'

import styled from '@emotion/styled'
import {
  Button,
  ButtonsGroup,
  Dropdown,
  DropdownOption,
  FourthLevelHeadline,
  Spacing,
} from '@hedvig-ui'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { PropsWithChildren, useEffect, useState } from 'react'
import * as React from 'react'
import { Trash } from 'react-bootstrap-icons'
import { convertCamelcaseToTitle, convertEnumToTitle } from '@hedvig-ui'
import {
  ArrayFieldTemplateProps,
  ErrorTransformer,
  ObjectFieldTemplateProps,
  WidgetProps,
} from '@rjsf/utils'

// We're using any to avoid JSONSchema7 conflicts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonRecord = Record<string, any>

export type JsonSchemaFormData = Record<string, JsonRecord | boolean>

const ContentWrapper = styled('div')<{ pushTop: boolean }>`
  margin-top: ${({ pushTop }) => (pushTop ? '2.75rem' : 0)};

  label {
    color: ${(p) => p.theme.foreground} !important;
  }
`
const ObjectFieldTemplate = ({ properties }: ObjectFieldTemplateProps) => {
  return (
    <div>
      {properties.map((property, index) => (
        <div key={index}>
          <ContentWrapper
            pushTop={
              property.content.props.schema.type === 'boolean' &&
              index % 2 === 1
            }
          >
            {property.content}
          </ContentWrapper>
        </div>
      ))}
    </div>
  )
}

const FormWrapper = styled.div`
  & .field-object,
  & fieldset {
    border: none;
  }

  & .field-object > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1em;
  }

  & .field {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;

    & > label {
      margin-bottom: 0.4rem;
      font-size: 0.95rem;
      color: ${({ theme }) => theme.semiStrongForeground} !important;
      font-weight: normal;
    }

    input {
      padding: 10px 15px;
      border-radius: 4px;
      border: 1px solid ${({ theme }) => theme.border};
    }
  }

  & .form-group {
    .checkbox {
      & > label {
        display: flex;
        align-items: center;

        font-size: 1rem;

        input {
          width: 17px;
          height: 17px;
          margin-right: 8px;
        }
      }
    }
  }

  & .panel-title,
  & .text-danger,
  & .required {
    color: ${({ theme }) => theme.danger};
  }
`

const ItemWrapper = styled('div')`
  margin: 1rem 0 1rem 0;

  &:not(:last-of-type) {
    padding-bottom: 0.75rem;
    border-bottom: 1px solid ${({ theme }) => theme.borderStrong};
  }
`

const ItemTitleWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
`

const TrashIcon = styled(Trash)`
  color: ${({ theme }) => theme.danger};
  width: 15px;
  height: 15px;
`

const ArrayFieldTemplate = ({
  items,
  onAddClick,
  title,
}: ArrayFieldTemplateProps) => {
  return (
    <>
      {title && (
        <Spacing bottom="small">
          <FourthLevelHeadline>
            {convertCamelcaseToTitle(title)}
          </FourthLevelHeadline>
        </Spacing>
      )}
      {items.map((element, index) => {
        return (
          <ItemWrapper key={element.key}>
            <ItemTitleWrapper>
              <strong>{index + 1}.</strong>
              <Button
                variant="tertiary"
                onClick={element.onDropIndexClick(index)}
              >
                <TrashIcon />
              </Button>
            </ItemTitleWrapper>
            {element.children}
          </ItemWrapper>
        )
      })}
      <Button
        onClick={(e) => {
          e.preventDefault()
          onAddClick()
        }}
      >
        + Add
      </Button>
    </>
  )
}

const CustomSelectWidget = ({ value, onChange, schema }: WidgetProps) => {
  const options: Array<{ value: string; text: string; key: string | number }> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema.enum?.map((enumValue: any, idx: number) => ({
      key: idx,
      text: convertEnumToTitle(enumValue as string),
      value: enumValue as string,
    })) ?? []

  return (
    <Dropdown>
      {options.map((opt) => (
        <DropdownOption
          selected={value === opt.value}
          key={opt.key}
          onClick={() => onChange(opt.value)}
        >
          {opt.text}
        </DropdownOption>
      ))}
    </Dropdown>
  )
}

const transformErrors: ErrorTransformer = (errors) => {
  return errors.map((error) => {
    const transformedError = { ...error }
    switch (error.name) {
      case 'type':
        if (error.params.type === 'integer') {
          transformedError.message = `Must be a number`
        } else if (error.params.type === 'string') {
          transformedError.message = `Must be a text`
        }
        break
      case 'maxLength':
        transformedError.message = `Should not be longer than ${transformedError.params.limit} characters`
        break
      case 'minLength':
        transformedError.message = `Should not be shorter than ${transformedError.params.limit} characters`
        break
      case 'minimum':
        transformedError.message = `Should be greater than ${
          !transformedError.params.exclusive && '(or equal to) '
        }${transformedError.params.limit}`
        break
      case 'maximum':
        transformedError.message = `Should be less than ${
          !transformedError.params.exlusive && '(or equal to) '
        }${transformedError.params.limit}`
        break
    }
    transformedError.stack = `${getPropertyTitle(
      transformedError?.property,
    )}: ${transformedError.message}`
    return transformedError
  })
}

const getPropertyTitle = (property: string | undefined) => {
  return convertCamelcaseToTitle(property?.substring(1) ?? 'undefined')
}

const formatInitialFormData = (
  initialFormData: JsonSchemaFormData,
  schema: JsonRecord,
): JsonSchemaFormData => {
  const properties = schema.properties
  const formData = { ...initialFormData }

  if (!properties) {
    return formData
  }

  Object.entries(properties).forEach(([key, value]) => {
    formData[key] =
      initialFormData[key] ?? (value as JsonRecord).default ?? undefined
  })

  return formData
}

export const JsonSchemaForm: React.FC<
  PropsWithChildren & {
    schema: JsonRecord
    onSubmit: (formData: Record<string, unknown>) => void
    onCancel?: () => void
    initialFormData?: JsonSchemaFormData
    suggestions?: JsonSchemaFormData
    submitText?: string
  }
> = ({
  schema,
  onSubmit,
  onCancel,
  initialFormData,
  suggestions,
  submitText,
  children,
}) => {
  const uiSchema = {
    'ui:ObjectFieldTemplate': ObjectFieldTemplate,
  }
  const [formData, setFormData] = useState<JsonSchemaFormData>(
    formatInitialFormData(initialFormData ?? {}, schema),
  )

  useEffect(() => {
    if (!suggestions) {
      return
    }

    setFormData((prevFormData) => {
      const newFormData = Object.keys(prevFormData).reduce<JsonSchemaFormData>(
        (acc, field) => ({
          ...acc,
          [field]: prevFormData[field] || suggestions[field],
        }),
        {},
      )
      return formatInitialFormData(newFormData ?? {}, schema)
    })
  }, [suggestions, schema])

  return (
    <FormWrapper>
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onChange={(e) => {
          if (e.formData === undefined) return
          setFormData(e.formData)
        }}
        onSubmit={(e) => {
          if (e.formData === undefined) return
          setFormData(e.formData)
          onSubmit(formData)
        }}
        transformErrors={transformErrors}
        templates={{ ArrayFieldTemplate }}
        validator={validator}
        widgets={{ SelectWidget: CustomSelectWidget }}
      >
        <ButtonsGroup>
          <Button type="submit">{submitText ?? 'Submit'}</Button>
          {onCancel && (
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault()
                onCancel()
              }}
            >
              Cancel
            </Button>
          )}
          {children}
        </ButtonsGroup>
      </Form>
    </FormWrapper>
  )
}
