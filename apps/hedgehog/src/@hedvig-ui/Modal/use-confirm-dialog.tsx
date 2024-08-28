'use client'

import styled from '@emotion/styled'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import * as React from 'react'
import {
  Button as DefaultButton,
  ButtonProps,
  Checkbox,
  Flex,
  Input,
  isPressing,
  Keys,
  Modal,
  TextArea,
  TextDatePicker,
} from '@hedvig-ui'

const ConfirmButtons = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 15px;
`

const Button = styled(DefaultButton)`
  position: relative;
  font-size: 0.875rem;
`

export const ConfirmDialogComponent: React.FC<{
  content: React.ReactNode
  confirmText?: string
  confirmValue?: string
  cancelText?: string
  close: () => void
  confirm: (value?: Record<string, string | boolean | undefined>) => void
  visible: boolean
  status?: ButtonProps['status']
  withValue?: boolean
  valueTypes?: ValueTypes
  defaultValues?: Record<string, string | boolean | undefined>
}> = ({
  content,
  confirmText,
  cancelText,
  close,
  confirm,
  visible,
  status = 'success',
  withValue = false,
  valueTypes,
  defaultValues,
}) => {
  const [values, setValues] = useState<
    Record<string, string | boolean | undefined>
  >(defaultValues ?? {})

  useEffect(() => {
    setValues(defaultValues ?? {})
  }, [defaultValues])

  return (
    <Modal
      visible={visible}
      style={{
        width: 400,
        padding: '1rem',
      }}
      options={{
        position: 'top',
      }}
      forceOverlay
      onClose={close}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (withValue) {
            setValues({})
            return confirm(values)
          }
          return confirm()
        }}
      >
        <Flex direction="column" gap="small">
          <h3
            style={{
              margin: 0,
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {content}
          </h3>
          {withValue &&
            !!valueTypes &&
            Object.entries(valueTypes).map(([name, options]) => {
              return (
                <Flex key={name} justify="start">
                  {options.type === 'checkbox' ? (
                    <Checkbox
                      label={options.label}
                      onChange={() =>
                        setValues((prev) => ({
                          ...prev,
                          [name]:
                            prev?.[name] === undefined ? true : !prev[name],
                        }))
                      }
                      checked={!!values?.[name]}
                    />
                  ) : options.type === 'input' ? (
                    <Input
                      autoFocus
                      required={!!options.required}
                      placeholder={options.label}
                      value={(values?.[name] as string) ?? ''}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [name]: e.target.value,
                        }))
                      }
                    />
                  ) : options.type === 'textarea' ? (
                    <TextArea
                      autoFocus
                      value={(values?.[name] as string) ?? ''}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [name]: e.target.value,
                        }))
                      }
                    />
                  ) : options.type === 'date' ? (
                    <TextDatePicker
                      pickerFloating={false}
                      required={!!options.required}
                      position="right"
                      minDate={options.min ? new Date(options.min) : undefined}
                      maxDate={options.max ? new Date(options.max) : undefined}
                      label={options.label}
                      value={(values?.[name] as string) ?? ''}
                      onChange={(date) =>
                        setValues((prev) => ({ ...prev, [name]: date ?? '' }))
                      }
                    />
                  ) : options.type === 'confirm' ? (
                    <Input
                      pattern={options.confirmValue}
                      autoFocus
                      placeholder={options.label}
                      value={(values?.[name] as string) ?? ''}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [name]: e.target.value,
                        }))
                      }
                    />
                  ) : null}
                </Flex>
              )
            })}
          <ConfirmButtons>
            <Button
              type="submit"
              size="small"
              status={status}
              autoFocus={!!values?.size}
            >
              {confirmText ? confirmText : 'Confirm'}
            </Button>

            <Button
              type="button"
              size="small"
              variant="tertiary"
              onClick={() => {
                setValues({})
                close()
              }}
              onKeyDown={(e) => {
                if (isPressing(e, Keys.Enter)) {
                  e.preventDefault()
                  setValues({})
                  close()
                }
              }}
            >
              {cancelText ?? 'Cancel'}
            </Button>
          </ConfirmButtons>
        </Flex>
      </form>
    </Modal>
  )
}

export interface ConfirmDialogContextProps {
  confirm: (
    content: React.ReactNode,
    status?: ButtonProps['status'],
    confirmText?: string,
  ) => Promise<void>
  confirmWithValue: ({
    content,
    label,
    status,
    confirmText,
    values,
    defaultValues,
  }: {
    content: React.ReactNode
    values: ValueTypes
    label?: string
    status?: ButtonProps['status']
    confirmText?: string
    defaultValues?: Record<string, string | boolean | undefined>
  }) => Promise<Record<string, string | boolean | undefined> | void>
}

const ConfirmDialogContext = createContext<ConfirmDialogContextProps>({
  confirm: () => Promise.resolve(),
  confirmWithValue: () => Promise.resolve({}),
})

export const useConfirmDialog = () => useContext(ConfirmDialogContext)

type ConfirmValueTypeOptions = {
  type: 'confirm'
  confirmValue: string
}
type FormValueTypeOptions = {
  type: 'checkbox' | 'input' | 'date' | 'textarea'
  min?: string
  max?: string
}
type ValueTypeOptions = {
  label?: string
  required?: boolean
} & (ConfirmValueTypeOptions | FormValueTypeOptions)

type ValueTypes = Record<string, ValueTypeOptions>

export const ConfirmDialogProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [message, setMessage] = useState<React.ReactNode>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [status, setStatus] = useState<ButtonProps['status']>()
  const [withValue, setWithValue] = useState(false)
  const [valueTypes, setValueTypes] = useState<ValueTypes | undefined>()
  const [defaultValues, setDefaultValues] = useState<
    Record<string, string | boolean | undefined> | undefined
  >()
  const [confirmText, setConfirmText] = useState('')

  const awaitingPromiseRef = useRef<{
    resolve:
      | (() => void)
      | ((
          value?: Record<string, string | boolean | undefined> | undefined,
        ) => void)
    reject: ({ message }: { message: string }) => void
  }>()

  const clearState = () => {
    setMessage('')
    setShowConfirmDialog(false)
    setStatus(undefined)
    setWithValue(false)
    setValueTypes(undefined)
    setConfirmText('')
    setDefaultValues(undefined)
  }

  const closeHandler = () => {
    if (awaitingPromiseRef.current) {
      clearState()
      awaitingPromiseRef.current.reject({ message: 'Cancel confirm' })
    }
  }

  const confirmHandler = () => {
    if (awaitingPromiseRef.current) {
      clearState()
      awaitingPromiseRef.current.resolve()
    }
  }

  const confirmWithValueHandler = (
    value: Record<string, string | boolean | undefined> | undefined,
  ) => {
    if (awaitingPromiseRef.current) {
      clearState()
      awaitingPromiseRef.current.resolve(value)
    }
  }

  const confirm = (
    m: React.ReactNode,
    status?: ButtonProps['status'],
    confirmText?: string,
  ) => {
    setMessage(m)
    setShowConfirmDialog(true)
    setStatus(status)
    setConfirmText(confirmText ?? '')

    return new Promise<void>((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject }
    })
  }

  const confirmWithValue = ({
    content,
    defaultValues,
    values,
    status,
    confirmText,
  }: {
    content: React.ReactNode
    values: ValueTypes
    defaultValues?: Record<string, string | boolean | undefined>
    label?: string
    status?: ButtonProps['status']
    confirmText?: string
    confirmValue?: string
  }) => {
    setMessage(content)
    setShowConfirmDialog(true)
    setWithValue(true)
    setValueTypes(values)
    setStatus(status)
    setConfirmText(confirmText ?? '')
    setDefaultValues(defaultValues)

    return new Promise<
      Record<string, string | boolean | undefined> | undefined
    >((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject }
    })
  }

  return (
    <ConfirmDialogContext.Provider
      value={{
        confirm,
        confirmWithValue,
      }}
    >
      {children}
      <ConfirmDialogComponent
        visible={showConfirmDialog}
        content={message}
        close={closeHandler}
        confirm={withValue ? confirmWithValueHandler : confirmHandler}
        confirmText={confirmText}
        status={status}
        withValue={withValue}
        valueTypes={valueTypes}
        defaultValues={defaultValues}
      />
    </ConfirmDialogContext.Provider>
  )
}
