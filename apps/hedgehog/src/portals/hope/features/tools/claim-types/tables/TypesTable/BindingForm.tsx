import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import {
  InsuranceType,
  InsuranceTypeCurrency,
} from '@hope/features/config/constants'
import {
  ClaimTypeBinding,
  GetClaimTypeBindingsDocument,
  UpdateClaimTypeBindingInput,
  useCreateClaimTypeBindingMutation,
  useDeleteClaimTypeBindingMutation,
  useGetClaimTypeBindingsQuery,
  useUpdateClaimTypeBindingMutation,
} from 'types/generated/graphql'
import {
  Button,
  Checkbox,
  Flex,
  Input,
  Keys,
  useClickOutside,
  Hint,
  isPressing,
  TableColumn,
  convertCamelcaseToTitle,
  convertEnumToTitle,
  extractErrorMessage,
} from '@hedvig-ui'
import styled from '@emotion/styled'
import toast from 'react-hot-toast'

export const TypeColumn = styled(TableColumn)`
  min-width: 13rem;
  border-bottom: 1px solid ${({ theme }) => theme.accentContrast} !important;
  padding: 1rem;
  position: relative;

  & * {
    font-size: 12px;
  }

  &:not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.accentContrast};
  }
`

const BindingContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const BindingTitle = styled.span`
  color: ${({ theme }) => theme.semiStrongForeground};
`

const SetText = styled.span<{ active: boolean }>`
  color: ${({ theme }) => theme.accent};
  cursor: pointer;
  opacity: ${({ active }) => (active ? 1 : 0.3)};

  &:hover {
    opacity: 0.6;
  }
`

const Form = styled.div`
  position: absolute;
  z-index: 10;
  top: 75%;
  left: 25%;

  width: 18rem;

  border-radius: 3px;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.backgroundLight};

  & button:hover {
    background: transparent;
  }
`

export const BindingForm: React.FC<{
  binding?: ClaimTypeBinding | null
  claimType: string
  insuranceType: InsuranceType
}> = ({ binding, claimType, insuranceType }) => {
  const [createBinding] = useCreateClaimTypeBindingMutation()
  const [updateBinding] = useUpdateClaimTypeBindingMutation()
  const [deleteBinding] = useDeleteClaimTypeBindingMutation()

  const { data: bindingData } = useGetClaimTypeBindingsQuery()
  const typeBindings = bindingData?.claimTypeBindings

  const [showForm, setShowForm] = useState<
    'defaultReserve' | 'defaultDeductible' | null
  >(null)

  const [value, setValue] = useState<{
    defaultReserve: number | null
    defaultDeductible: number | null
  }>({
    defaultReserve: binding?.defaultReserve || null,
    defaultDeductible: binding?.defaultDeductible || null,
  })

  useEffect(() => {
    if (!binding) {
      return
    }

    if (
      binding.defaultDeductible &&
      binding.defaultDeductible !== value.defaultDeductible
    ) {
      setValue((prev) => ({
        ...prev,
        defaultDeductible: binding.defaultDeductible || null,
      }))
    }

    if (
      binding.defaultReserve &&
      binding.defaultReserve !== value.defaultReserve
    ) {
      setValue((prev) => ({
        ...prev,
        defaultReserve: binding.defaultReserve || null,
      }))
    }
  }, [
    binding,
    binding?.defaultDeductible,
    value.defaultDeductible,
    value.defaultReserve,
  ])

  const formRef = useRef<HTMLDivElement>(null)
  useClickOutside(formRef, () => setShowForm(null))

  const createBindingHandler = async (
    claimType: string,
    insuranceType: InsuranceType,
  ) => {
    await toast.promise(
      createBinding({
        variables: {
          request: {
            claimType,
            insuranceType,
            defaultDeductible: null,
            defaultReserve: null,
          },
        },
        refetchQueries: [{ query: GetClaimTypeBindingsDocument }],
      }),
      {
        loading: 'Binding...',
        success: `Bound "${convertEnumToTitle(
          claimType,
        )}" to "${convertEnumToTitle(insuranceType)}"`,
        error: 'Binding failed.',
      },
    )
  }

  const updateBindingHandler = async (
    id: string,
    defaultAmountType: 'defaultReserve' | 'defaultDeductible',
    value: number | null,
  ) => {
    const updatingBinding = typeBindings?.find((bind) => bind?.id === id)

    if (!updatingBinding) {
      return
    }

    const request: UpdateClaimTypeBindingInput = {
      defaultReserve:
        defaultAmountType === 'defaultReserve'
          ? value
          : updatingBinding.defaultReserve,
      defaultDeductible:
        defaultAmountType === 'defaultDeductible'
          ? value
          : updatingBinding.defaultDeductible,
    }

    await toast.promise(
      updateBinding({
        variables: {
          id,
          request,
        },
        optimisticResponse: {
          claimTypeBinding_update: { ...updatingBinding, ...request },
        },
      }),
      {
        loading: `Updating ${convertCamelcaseToTitle(defaultAmountType)}...`,
        success: `${convertCamelcaseToTitle(defaultAmountType)} updated!`,
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const deleteBindingHandler = async (id: string) => {
    await toast.promise(
      deleteBinding({
        variables: {
          id,
        },
        optimisticResponse: {
          claimTypeBinding_delete: true,
        },
        refetchQueries: [{ query: GetClaimTypeBindingsDocument }],
      }),
      {
        loading: 'Deleting...',
        success: 'Deleted!',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  const currency = InsuranceTypeCurrency[insuranceType]

  return (
    <TypeColumn>
      <Flex gap="tiny">
        <Checkbox
          checked={!!binding}
          onChange={() =>
            binding
              ? deleteBindingHandler(binding.id)
              : createBindingHandler(claimType, insuranceType)
          }
        />
        <BindingContent style={binding ? {} : { opacity: '0.25' }}>
          <span>Bind</span>
          <Flex justify="space-between">
            <BindingTitle>Reserve</BindingTitle>
            <SetText
              active={!!binding}
              onClick={(e) => {
                e.preventDefault()
                if (binding) {
                  setShowForm('defaultReserve')
                }
              }}
            >
              {binding?.defaultReserve
                ? `${binding.defaultReserve} ${currency}`
                : 'set'}
            </SetText>
          </Flex>
          <Flex justify="space-between">
            <BindingTitle>Deductible</BindingTitle>
            <SetText
              active={!!binding}
              onClick={(e) => {
                e.preventDefault()
                if (binding) {
                  setShowForm('defaultDeductible')
                }
              }}
            >
              {binding?.defaultDeductible
                ? `${binding.defaultDeductible} ${currency}`
                : 'set'}
            </SetText>
          </Flex>
        </BindingContent>
      </Flex>

      {showForm && (
        <Form ref={formRef}>
          <Flex>
            <Input
              type="number"
              autoFocus
              affix={{ content: currency }}
              value={value[showForm]?.toString() || ''}
              onChange={({ currentTarget: { value } }) =>
                setValue((prev) => ({ ...prev, [showForm]: +value }))
              }
              onKeyDown={async (e) => {
                const newValue = value[showForm]

                if (!newValue || +newValue < 0) {
                  return
                }

                if (e.metaKey && isPressing(e, Keys.Enter) && !!binding) {
                  await updateBindingHandler(
                    binding.id,
                    showForm,
                    value[showForm],
                  )
                  setShowForm(null)
                }
              }}
            />
            <Button
              variant="tertiary"
              type="button"
              style={{ color: 'red' }}
              onClick={async () => {
                if (!binding) {
                  return
                }

                setValue((prev) => ({ ...prev, [showForm]: null }))
                await updateBindingHandler(binding.id, showForm, null)
                setShowForm(null)
              }}
            >
              Clear
            </Button>
          </Flex>

          <Hint
            variant="secondary"
            textPosition="right"
            style={{
              position: 'unset',
              background: 'transparent',
              marginTop: '0.5rem',
            }}
            text="to add"
            keys={[Keys.Command, Keys.Enter]}
          />
        </Form>
      )}
    </TypeColumn>
  )
}
