import type { TextSprinkles } from 'ui/src/components/Text/Text.css'
import { Button, Heading, Space, Text, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { AttentionCard, CampaignCard } from '@/components/InfoCard/InfoCard'
import { InputCarRegistrationNumber } from '@/components/InputCarRegistrationNumber/InputCarRegistrationNumber'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { Field, useCarBuyerCreatePageState, createCarTrial } from './CarBuyerCreatePage.helpers'
import { resultRow, wrapper } from './DebuggerCarTrial.css'

const TIER_OPTIONS = [
  { name: 'Half', value: '1' },
  { name: 'Full', value: '2' },
]

export const DebuggerCarTrialPage = () => {
  const [state, setState] = useCarBuyerCreatePageState()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const ssn = formData.get(Field.SSN) as string
    const registrationNumber = formData.get(Field.RegistrationNumber) as string
    const tier = formData.get(Field.Tier) as string

    setState((prevState) => ({ ...prevState, type: 'LOADING' }))

    const parameters = { ssn, registrationNumber, vtrCoverageCode: tier }
    try {
      const result = await createCarTrial({ ...parameters, dealerId: 'MODERNA_BIL' })
      setState({
        type: 'IDLE',
        parameters,
        result,
      })
    } catch (error) {
      setState({
        type: 'IDLE',
        parameters,
        result: {
          type: 'error',
          errorCode: 'UNKNOWN_ERROR',
          errorMessage: 'Something went wrong. Please try again.',
        },
      })
    }
  }

  return (
    <Space>
      <div className={wrapper}>
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <Space y={2}>
              <Heading
                as="h1"
                align="center"
                balance={true}
                variant={{ _: 'serif.24', lg: 'serif.32' }}
                mt={theme.space.xl}
              >
                Create car trial
              </Heading>

              <form onSubmit={handleSubmit}>
                <Space y={0.25}>
                  <PersonalNumberField name={Field.SSN} label="SSN (YYMMDD-XXXX)" required={true} />
                  <InputCarRegistrationNumber
                    name={Field.RegistrationNumber}
                    label="Registration number"
                    required={true}
                  />
                  <InputSelect
                    name={Field.Tier}
                    label="Tier"
                    required={true}
                    defaultValue="1"
                    options={TIER_OPTIONS}
                  />
                  <Space y={0.5}>
                    <Button type="submit" loading={state.type === 'LOADING'}>
                      Create car trial
                    </Button>
                    <Text as="p" size="xs" align="center" color="textSecondary">
                      This is an internal tool
                    </Text>
                  </Space>
                </Space>
              </form>

              {state.parameters && state.result && (
                <div style={{ opacity: state.type === 'LOADING' ? 0.5 : 1 }}>
                  {state.result.type === 'success' && (
                    <SuccessCard trialUrl={state.result.trialUrl} />
                  )}

                  {state.result.type === 'error' && (
                    <ErrorCard
                      errorCode={state.result.errorCode}
                      errorMessage={state.result.errorMessage}
                    />
                  )}
                </div>
              )}
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>
      </div>
    </Space>
  )
}

function DisplayRow(props: { title: string; displayValue: string; color: TextSprinkles['color'] }) {
  return (
    <div className={resultRow}>
      <Text as="p" color={props.color}>
        {props.title}
      </Text>
      <Text as="p" color={props.color}>
        {props.displayValue}
      </Text>
    </div>
  )
}

const SuccessCard = (props: { trialUrl: string }) => {
  return (
    <CampaignCard>
      <Space y={0.5} style={{ width: '100%' }}>
        <div className={resultRow}>
          <Text as="p" color="textTranslucentPrimary">
            Trial created
          </Text>
        </div>
        <a
          href={props.trialUrl}
          style={{ textDecoration: 'underline' }}
          target="_blank"
          rel="noreferrer"
        >
          {props.trialUrl}
        </a>
      </Space>
    </CampaignCard>
  )
}

const ErrorCard = (props: { errorCode: string; errorMessage: string }) => (
  <AttentionCard>
    <Space y={0.5} style={{ width: '100%' }}>
      <div className={resultRow}>
        <Text as="p" color="textTranslucentPrimary">
          Unable to create trial
        </Text>
      </div>
      <DisplayRow title="Felkod:" displayValue={props.errorCode} color="signalAmberText" />
      <Text as="p" color="signalAmberText">
        {props.errorMessage}
      </Text>
    </Space>
  </AttentionCard>
)
