import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import type { Sprinkles } from 'ui/src/theme/sprinkles.css'
import { Button, Heading, HedvigLogo, Space, Text, mq, theme } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { HEADER_HEIGHT_MOBILE, HEADER_HEIGHT_DESKTOP } from '@/components/Header/Header.constants'
import { AttentionCard, CampaignCard } from '@/components/InfoCard/InfoCard'
import { InputCarRegistrationNumber } from '@/components/InputCarRegistrationNumber/InputCarRegistrationNumber'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { TextField } from '@/components/TextField/TextField'
import type { Money } from '@/utils/formatter'
import {
  Field,
  useCarBuyerValidationPageState,
  validateCarTrial,
} from './CarBuyerValidationPage.helpers'

type Props = { dealerId: string }

const TIER_OPTIONS = [
  { name: 'Halvförsäkring', value: '1' },
  { name: 'Helförsäkring', value: '2' },
]

export const CarBuyerValidationPage = (props: Props) => {
  const [state, setState] = useCarBuyerValidationPageState()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    datadogRum.addAction('Car Buyer Validation', { dealerId: props.dealerId })

    const form = event.currentTarget
    const formData = new FormData(form)
    const ssn = formData.get(Field.SSN) as string
    const registrationNumber = formData.get(Field.RegistrationNumber) as string
    const tier = formData.get(Field.Tier) as string

    setState((prevState) => ({ ...prevState, type: 'LOADING' }))

    const parameters = { ssn, registrationNumber, vtrCoverageCode: tier }
    try {
      const result = await validateCarTrial({ ...parameters, dealerId: props.dealerId })
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
          errorCode: 'OKÄNT_FEL',
          errorMessage: 'Något gick fel. Försök igen senare.',
        },
      })
    }
  }

  return (
    <Space>
      <Header>
        <HedvigLogo />
      </Header>
      <Wrapper>
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <Space y={2}>
              <Heading
                as="h1"
                align="center"
                balance={true}
                variant={{ _: 'serif.24', lg: 'serif.32' }}
              >
                Kolla om kunden kan ta del av ◰-erbjudandet
              </Heading>

              <form onSubmit={handleSubmit}>
                <Space y={0.25}>
                  <TextField label="Bilhandlare" disabled={true} value={props.dealerId} />
                  <PersonalNumberField
                    name={Field.SSN}
                    label="Personnummer (YYMMDD-XXXX)"
                    required={true}
                  />
                  <InputCarRegistrationNumber
                    name={Field.RegistrationNumber}
                    label="Registeringsnummer"
                    required={true}
                  />
                  <InputSelect
                    name={Field.Tier}
                    label="Skyddsnivå"
                    required={true}
                    defaultValue="2"
                    options={TIER_OPTIONS}
                  />
                  <Space y={0.5}>
                    <Button type="submit" loading={state.type === 'LOADING'} fullWidth={true}>
                      Validera kund
                    </Button>
                    <Text as="p" size="xs" align="center" color="textSecondary">
                      OBS: Detta är ett internt verktyg
                    </Text>
                  </Space>
                </Space>
              </form>

              {state.parameters && state.result && (
                <div style={{ opacity: state.type === 'LOADING' ? 0.5 : 1 }}>
                  {state.result.type === 'success' && (
                    <SuccessCard
                      ssn={state.parameters.ssn}
                      registrationNumber={state.parameters.registrationNumber}
                      trialPrice={state.result.trialPrice}
                    />
                  )}

                  {state.result.type === 'error' && (
                    <ErrorCard
                      ssn={state.parameters.ssn}
                      registrationNumber={state.parameters.registrationNumber}
                      errorCode={state.result.errorCode}
                      errorMessage={state.result.errorMessage}
                    />
                  )}
                </div>
              )}
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>
      </Wrapper>
    </Space>
  )
}

function DisplayRow(props: { title: string; displayValue: string; color: Sprinkles['color'] }) {
  return (
    <ResultRow>
      <Text as="p" color={props.color}>
        {props.title}
      </Text>
      <Text as="p" color={props.color}>
        {props.displayValue}
      </Text>
    </ResultRow>
  )
}

const SuccessCard = (props: { ssn: string; registrationNumber: string; trialPrice: Money }) => {
  return (
    <CampaignCard>
      <Space y={0.5} style={{ width: '100%' }}>
        <ResultRow>
          <Text as="p" color="textTranslucentPrimary">
            Validering godkänd
          </Text>
        </ResultRow>
        <DisplayRow title="Personnummer:" displayValue={props.ssn} color="signalGreenText" />
        <DisplayRow
          title="Registreringsnummer:"
          displayValue={props.registrationNumber}
          color="signalGreenText"
        />
        <DisplayRow
          title="Månadspris första 60 dagarna:"
          displayValue={`${props.trialPrice.amount} ${props.trialPrice.currencyCode} / må`}
          color="signalGreenText"
        />
      </Space>
    </CampaignCard>
  )
}

const ErrorCard = (props: {
  ssn: string
  registrationNumber: string
  errorCode: string
  errorMessage: string
}) => (
  <AttentionCard>
    <Space y={0.5} style={{ width: '100%' }}>
      <ResultRow>
        <Text as="p" color="textTranslucentPrimary">
          Validering ej godkänd
        </Text>
      </ResultRow>
      <DisplayRow title="Personnummer:" displayValue={props.ssn} color="signalAmberText" />
      <DisplayRow
        title="Registreringsnummer:"
        displayValue={props.registrationNumber}
        color="signalAmberText"
      />
      <DisplayRow title="Felkod:" displayValue={props.errorCode} color="signalAmberText" />
      <Text as="p" color="signalAmberText">
        {props.errorMessage}
      </Text>
    </Space>
  </AttentionCard>
)

const Header = styled.header({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: HEADER_HEIGHT_MOBILE,
  [mq.lg]: { height: HEADER_HEIGHT_DESKTOP },
})

const Wrapper = styled.div({ paddingBottom: theme.space.xl })

const ResultRow = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  // Align with icon
  ':first-of-type': { marginTop: -3 },
})
