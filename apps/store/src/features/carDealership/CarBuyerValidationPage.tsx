import { datadogRum } from '@datadog/browser-rum'
import styled from '@emotion/styled'
import { Button, Heading, HedvigLogo, Space, Text, mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { HEADER_HEIGHT_DESKTOP, HEADER_HEIGHT_MOBILE } from '@/components/Header/Header'
import { AttentionCard, CampaignCard } from '@/components/InfoCard/InfoCard'
import { InputCarRegistrationNumber } from '@/components/InputCarRegistrationNumber/InputCarRegistrationNumber'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { TextField } from '@/components/TextField/TextField'
import {
  Field,
  useCarBuyerValidationPageState,
  validateCarTrial,
} from './CarBuyerValidationPage.helpers'

type Props = { dealerId: string }

type ValidationError = { code: string; message: string }

type Result = {
  ssn: string
  registrationNumber: string
  error?: ValidationError
}

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
        result: { ...parameters, error: result.error },
      })
    } catch (error) {
      const unknownError = { code: 'OKÄNT_FEL', message: 'Något gick fel. Försök igen senare.' }
      setState({
        type: 'IDLE',
        result: { ...parameters, error: unknownError },
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
                    defaultValue="1"
                    options={TIER_OPTIONS}
                  />
                  <Space y={0.5}>
                    <Button type="submit" loading={state.type === 'LOADING'}>
                      Validera kund
                    </Button>
                    <Text as="p" size="xs" align="center" color="textSecondary">
                      OBS: Detta är ett internt verktyg
                    </Text>
                  </Space>
                </Space>
              </form>

              {state.result && (
                <div style={{ opacity: state.type === 'LOADING' ? 0.5 : 1 }}>
                  {!state.result.error && (
                    <SuccesCard
                      ssn={state.result.ssn}
                      registrationNumber={state.result.registrationNumber}
                    />
                  )}

                  {state.result.error && (
                    <ErrorCard
                      ssn={state.result.ssn}
                      registrationNumber={state.result.registrationNumber}
                      error={state.result.error}
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

const SuccesCard = (props: Result) => (
  <CampaignCard>
    <Space y={0.5} style={{ width: '100%' }}>
      <ResultRow>
        <Text as="p" color="textTranslucentPrimary">
          Validering godkänd
        </Text>
      </ResultRow>
      <ResultRow>
        <Text as="p" color="signalGreenText">
          Personnummer:
        </Text>
        <Text as="p" color="signalGreenText">
          {props.ssn}
        </Text>
      </ResultRow>

      <ResultRow>
        <Text as="p" color="signalGreenText">
          Registreringsnummer:
        </Text>
        <Text as="p" color="signalGreenText">
          {props.registrationNumber}
        </Text>
      </ResultRow>
    </Space>
  </CampaignCard>
)

const ErrorCard = (props: Result) => (
  <AttentionCard>
    <Space y={0.5} style={{ width: '100%' }}>
      <ResultRow>
        <Text as="p" color="textTranslucentPrimary">
          Validering ej godkänd
        </Text>
      </ResultRow>
      <ResultRow>
        <Text as="p" color="signalAmberText">
          Personnummer:
        </Text>
        <Text as="p" color="signalAmberText">
          {props.ssn}
        </Text>
      </ResultRow>

      <ResultRow>
        <Text as="p" color="signalAmberText">
          Registreringsnummer:
        </Text>
        <Text as="p" color="signalAmberText">
          {props.registrationNumber}
        </Text>
      </ResultRow>

      {props.error && (
        <>
          <ResultRow>
            <Text as="p" color="signalAmberText">
              Felkod:
            </Text>
            <Text as="p" color="signalAmberText">
              {props.error.code}
            </Text>
          </ResultRow>
          <Text as="p" color="signalAmberText">
            {props.error.message}
          </Text>
        </>
      )}
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
