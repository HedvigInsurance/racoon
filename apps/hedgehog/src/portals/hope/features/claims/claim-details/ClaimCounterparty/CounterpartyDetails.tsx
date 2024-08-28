import styled from '@emotion/styled'
import {
  Button,
  ButtonsGroup,
  convertEnumToTitle,
  Input,
  Select,
  Spacing,
  useConfirmDialog,
} from '@hedvig-ui'
import gql from 'graphql-tag'
import { InvoiceModal } from '@hope/features/claims/claim-details/ClaimCounterparty/InvoiceModal'
import { LiabilityLevel } from '@hope/features/config/constants'
import { useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  ClaimCounterpartyFragment,
  RecoveryInvoice,
  useCreateCounterpartyRecoveryInvoiceMutation,
  useInsuranceProvidersQuery,
  useUpdateCounterpartyInsuranceProviderMutation,
  useUpdateCounterpartyLiabilityLevelMutation,
} from 'types/generated/graphql'

gql`
  query InsuranceProviders {
    insuranceProviders {
      id
      displayName
      email
      phoneNumber
      type
    }
  }

  mutation UpdateCounterpartyLiabilityLevel(
    $counterpartyId: ID!
    $liabilityLevel: String
  ) {
    counterparty_updateLiabilityLevel(
      counterpartyId: $counterpartyId
      liabilityLevel: $liabilityLevel
    ) {
      id
      liabilityLevel
    }
  }

  mutation UpdateCounterpartyInsuranceProvider(
    $counterpartyId: ID!
    $insuranceProviderId: ID
  ) {
    counterparty_updateInsuranceProvider(
      counterpartyId: $counterpartyId
      insuranceProviderId: $insuranceProviderId
    ) {
      id
      insuranceProvider {
        id
      }
    }
  }

  mutation CreateCounterpartyRecoveryInvoice(
    $counterpartyId: ID!
    $memberReference: String!
  ) {
    counterparty_createRecoveryInvoice(
      counterpartyId: $counterpartyId
      memberReference: $memberReference
    ) {
      ...ClaimCounterparty
    }
  }
`

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 0.375rem;
`

export const CounterpartyDetails: React.FC<{
  memberReference: string
  counterparty: ClaimCounterpartyFragment
}> = ({ memberReference, counterparty }) => {
  const [updateCounterpartyLiabilityLevel] =
    useUpdateCounterpartyLiabilityLevelMutation()
  const [updateCounterpartyInsuranceProvider] =
    useUpdateCounterpartyInsuranceProviderMutation()
  const { data } = useInsuranceProvidersQuery()
  const [createRecoveryInvoice] = useCreateCounterpartyRecoveryInvoiceMutation()
  const insuranceProviders = data?.insuranceProviders ?? []
  const invoice = (counterparty.recoveryInvoices[0] as RecoveryInvoice) ?? null
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const { confirm } = useConfirmDialog()
  return (
    <>
      <Fields>
        <Input
          disabled={true}
          label="External Reference"
          value={counterparty.reference}
        />
        <Select
          label="Insurance Provider (if applicable)"
          value={counterparty?.insuranceProvider?.id ?? 'not_specified'}
          options={[
            {
              text: 'Not specified',
              value: 'not_specified',
            },
            ...insuranceProviders.map((insuranceProvider) => ({
              text: convertEnumToTitle(insuranceProvider.id),
              value: insuranceProvider.id,
            })),
          ]}
          onChange={async ({ currentTarget: { value } }) => {
            await toast.promise(
              updateCounterpartyInsuranceProvider({
                variables: {
                  counterpartyId: counterparty.id,
                  insuranceProviderId: value === 'not_specified' ? null : value,
                },
              }),
              {
                loading: 'Updating insurance provider...',
                success: 'Insurance provider updated',
                error: 'Error while updating insurance provider!',
              },
            )
          }}
        />
        <Select
          label="Level of Liability (if applicable)"
          value={counterparty?.liabilityLevel ?? 'not_specified'}
          options={[
            {
              text: 'Not specified',
              value: 'not_specified',
            },
            ...Object.values(LiabilityLevel).map((liabilityLevel) => ({
              text: convertEnumToTitle(liabilityLevel),
              value: liabilityLevel,
            })),
          ]}
          onChange={async ({ currentTarget: { value } }) => {
            await toast.promise(
              updateCounterpartyLiabilityLevel({
                variables: {
                  counterpartyId: counterparty.id,
                  liabilityLevel: value === 'not_specified' ? null : value,
                },
              }),
              {
                loading: 'Updating liability level...',
                success: 'Liability level updated',
                error: 'Error while updating liability level!',
              },
            )
          }}
        />
      </Fields>
      <Spacing top="small" />
      {!invoice ? (
        <Button
          disabled={
            !(
              counterparty.insuranceProvider &&
              counterparty.liabilityLevel !== null &&
              memberReference &&
              counterparty.id
            )
          }
          onClick={() => {
            confirm(
              'An invoice will be generated with all recovery records of the selected counterparty included. Do you want to proceed?',
            ).then(() => {
              if (!memberReference)
                return toast.error(
                  'No registration plate number active on contract',
                )
              createRecoveryInvoice({
                variables: {
                  counterpartyId: counterparty.id,
                  memberReference,
                },
              })
                .then(() => setShowInvoiceModal(true))
                .catch(() =>
                  toast.error('Something went wrong generating invoice'),
                )
            })
          }}
        >
          Generate invoice
        </Button>
      ) : (
        <>
          <ButtonsGroup>
            <Button onClick={() => setShowInvoiceModal(true)}>
              Show invoice
            </Button>
            <Button
              variant="tertiary"
              disabled={
                !(
                  counterparty.insuranceProvider &&
                  counterparty.liabilityLevel !== null &&
                  memberReference &&
                  counterparty.id
                ) || invoice.isSettled
              }
              onClick={() => {
                confirm(
                  'The invoice will be re-generated with all recovery records of the selected counterparty included. Do you want to proceed?',
                ).then(() => {
                  if (!memberReference)
                    return toast.error(
                      'No registration plate number active on contract',
                    )
                  createRecoveryInvoice({
                    variables: {
                      counterpartyId: counterparty.id,
                      memberReference,
                    },
                  })
                    .then(() => setShowInvoiceModal(true))
                    .catch(() =>
                      toast.error('Something went wrong generating invoice'),
                    )
                })
              }}
            >
              Re-Generate invoice
            </Button>
          </ButtonsGroup>
          <InvoiceModal
            visible={showInvoiceModal}
            onClose={() => setShowInvoiceModal(false)}
            invoice={invoice}
          />
        </>
      )}
    </>
  )
}
