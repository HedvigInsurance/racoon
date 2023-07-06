import { Meta, StoryObj } from '@storybook/react'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ShopSessionOutcomeDocument } from '@/services/apollo/generated'
import { AppErrorProvider } from '@/services/appErrors/AppErrorContext'
import { SwitchingAssistantSection } from './SwitchingAssistantSection'

const meta: Meta<typeof SwitchingAssistantSection> = {
  title: 'Checkout / ConfirmationPage / SwitchingAssistantSection',
  component: SwitchingAssistantSection,
}

export default meta
type Story = StoryObj<typeof SwitchingAssistantSection>

const Template: Story = {
  render: (args) => (
    <AppErrorProvider>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <SwitchingAssistantSection {...args} />
        </GridLayout.Content>
      </GridLayout.Root>
    </AppErrorProvider>
  ),
}

export const Default: Story = {
  ...Template,
  args: {
    shopSessionId: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
    companyDisplayName: 'ICA Försäkring',
  },
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: ShopSessionOutcomeDocument,
            variables: {
              shopSessionId: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
            },
          },
          result: {
            data: {
              shopSession: {
                id: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
                outcome: {
                  id: 'd17845cb-16f3-4318-909e-e73888e1ef09',
                  createdContracts: [
                    {
                      id: '11f48e7e-62de-4fdc-ac3b-6863a908c58f',
                      variant: {
                        displayName: 'Full coverage',
                        __typename: 'ProductVariant',
                      },
                      externalInsuranceCancellation: {
                        id: '9f015c25-b8bf-4da2-afab-077f2b2f28a1',
                        status: 'NOT_INITIATED',
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
                __typename: 'ShopSession',
              },
            },
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
              shopSessionId: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
            },
          },
          result: {
            data: {
              shopSession: {
                id: 'ecf94a27-9daa-460e-a272-48b60f2d74ec',
                outcome: {
                  id: 'd17845cb-16f3-4318-909e-e73888e1ef09',
                  createdContracts: [
                    {
                      id: '11f48e7e-62de-4fdc-ac3b-6863a908c58f',
                      variant: {
                        displayName: 'Full coverage',
                        __typename: 'ProductVariant',
                      },
                      externalInsuranceCancellation: {
                        id: '9f015c25-b8bf-4da2-afab-077f2b2f28a1',
                        status: 'COMPLETED',
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
                __typename: 'ShopSession',
              },
            },
          },
        },
      ],
    },
  },
}
