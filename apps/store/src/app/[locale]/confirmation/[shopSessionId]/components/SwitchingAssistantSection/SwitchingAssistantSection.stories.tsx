import type { Meta, StoryObj } from '@storybook/react'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import {
  ContractExternalInsuranceCancellationStatus,
  ShopSessionOutcomeDocument,
  type ShopSessionOutcomeQuery,
  type ShopSessionOutcomeQueryVariables,
} from '@/services/graphql/generated'
import { SwitchingAssistantSection } from './SwitchingAssistantSection'

const meta: Meta<typeof SwitchingAssistantSection> = {
  title: 'Checkout / ConfirmationPage / SwitchingAssistantSection',
  component: SwitchingAssistantSection,
}

export default meta
type Story = StoryObj<typeof SwitchingAssistantSection>

const Template: Story = {
  render: (args) => (
    <GridLayout.Root>
      <GridLayout.Content width="1/3" align="center">
        <SwitchingAssistantSection {...args} />
      </GridLayout.Content>
    </GridLayout.Root>
  ),
}

export const Default: Story = {
  ...Template,
  args: {
    shopSessionOutcomeId: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
    companyDisplayName: 'ICA Försäkring',
  },
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: ShopSessionOutcomeDocument,
            variables: {
              shopSessionOutcomeId: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
            } satisfies ShopSessionOutcomeQueryVariables,
          },
          result: {
            data: {
              shopSessionOutcome: {
                id: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
                createdContracts: [
                  {
                    id: '11f48e7e-62de-4fdc-ac3b-6863a908c58f',
                    currentAgreement: {
                      productVariant: {
                        displayNameSubtype: '',
                        displayName: 'Full coverage',
                      },
                    },
                    externalInsuranceCancellation: {
                      id: '9f015c25-b8bf-4da2-afab-077f2b2f28a1',
                      status: ContractExternalInsuranceCancellationStatus.NotInitiated,
                      externalInsurer: {
                        id: 'ICA FÖRSÄKRING',
                        displayName: 'ICA FÖRSÄKRING',
                        __typename: 'ExternalInsurer',
                      },
                      bankSignering: {
                        approveByDate: '2023-07-24',
                        url: null,
                        __typename: 'ContractBankSigneringCancellation',
                      },
                      __typename: 'ContractExternalInsuranceCancellation',
                    },
                    __typename: 'Contract',
                  },
                ],
                __typename: 'ShopSessionOutcome',
              },
            } satisfies ShopSessionOutcomeQuery,
          },
        },
      ],
    },
  },
}

export const Completed: Story = {
  ...Template,
  args: {
    ...Default.args,
  },
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: ShopSessionOutcomeDocument,
            variables: {
              shopSessionOutcomeId: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
            } satisfies ShopSessionOutcomeQueryVariables,
          },
          result: {
            data: {
              shopSessionOutcome: {
                id: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
                createdContracts: [
                  {
                    id: '11f48e7e-62de-4fdc-ac3b-6863a908c58f',
                    currentAgreement: {
                      productVariant: {
                        displayNameSubtype: '',
                        displayName: 'Full coverage',
                      },
                    },
                    externalInsuranceCancellation: {
                      id: '9f015c25-b8bf-4da2-afab-077f2b2f28a1',
                      status: ContractExternalInsuranceCancellationStatus.Completed,
                      externalInsurer: {
                        id: 'ICA FÖRSÄKRING',
                        displayName: 'ICA FÖRSÄKRING',
                        __typename: 'ExternalInsurer',
                      },
                      bankSignering: {
                        approveByDate: '2023-07-24',
                        url: null,
                        __typename: 'ContractBankSigneringCancellation',
                      },
                      __typename: 'ContractExternalInsuranceCancellation',
                    },
                    __typename: 'Contract',
                  },
                ],
                __typename: 'ShopSessionOutcome',
              },
            } satisfies ShopSessionOutcomeQuery,
          },
        },
      ],
    },
  },
}
