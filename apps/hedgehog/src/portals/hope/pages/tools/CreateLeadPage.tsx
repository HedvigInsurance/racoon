import {
  Button,
  Checkbox,
  convertEnumToTitle,
  Input,
  MainHeadline,
  SecondLevelHeadline,
  useTitle,
} from '@hedvig-ui'
import { FC, Fragment, useEffect, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import styled from '@emotion/styled'
import {
  ContractMarketTypes,
  InsuranceType,
  Market,
  MarketFlags,
} from '../../features/config/constants'
import gql from 'graphql-tag'
import { useCreateLeadsMutation } from 'types/generated/graphql'
import NorwegianHomeFields from '../../features/tools/create-lead/forms/NorwegianHomeFields'
import NorwegianHouseFields from '../../features/tools/create-lead/forms/NorwegianHouseFields'
import DanishHomeAccidentTravelFields from '../../features/tools/create-lead/forms/DanishHomeAccidentTravelFields'
import NorwegianAccidentFields from '../../features/tools/create-lead/forms/NorwegianAccidentFields'
import NorwegianTravelFields from '../../features/tools/create-lead/forms/NorwegianTravelFields'
import SwedishAccidentFields from '../../features/tools/create-lead/forms/SwedishAccidentFields'
import SwedishHouseFields from '../../features/tools/create-lead/forms/SwedishHouseFields'
import SwedishApartmentFields from '../../features/tools/create-lead/forms/SwedishApartmentFields'
import SwedishCarFields from '../../features/tools/create-lead/forms/SwedishCarFields'
import DanishHouseFields from '../../features/tools/create-lead/forms/DanishHouseFields'

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  max-width: 400px;
`

const GapWrapper = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
`

gql`
  mutation CreateLeads($input: [CreateLeadInput!]!) {
    leads_create(input: $input)
  }
`

const getFormFields = (insuranceType: InsuranceType): JSX.Element | null => {
  switch (insuranceType) {
    case InsuranceType.DanishAccident:
    case InsuranceType.DanishTravel:
    case InsuranceType.DanishHomeContent:
      return <DanishHomeAccidentTravelFields />
    case InsuranceType.DanishHouse:
      return <DanishHouseFields />
    case InsuranceType.NorwegianHouse:
      return <NorwegianHouseFields />
    case InsuranceType.NorwegianHomeContent:
      return <NorwegianHomeFields />
    case InsuranceType.NorwegianAccident:
      return <NorwegianAccidentFields />
    case InsuranceType.NorwegianTravel:
      return <NorwegianTravelFields />
    case InsuranceType.SwedishAccident:
      return <SwedishAccidentFields />
    case InsuranceType.SwedishHouse:
      return <SwedishHouseFields />
    case InsuranceType.SwedishApartment:
      return <SwedishApartmentFields />
    case InsuranceType.SwedishCar:
      return <SwedishCarFields />
    default:
      return null
  }
}

const formatDataFormProps = (props: FieldValues) => {
  const newProps = props
  Object.entries(props).forEach(([key, value]) => {
    if (
      ['isStudent', 'isYouth', 'isSubleted', 'waterLeakageDetector'].includes(
        key,
      )
    ) {
      newProps[key] = value === 'true'
    } else if (key === 'extraBuildings') {
      value.forEach(
        (
          { hasWaterConnected }: { hasWaterConnected: 'yes' | 'no' },
          index: number,
        ) => {
          newProps[key][index].hasWaterConnected = hasWaterConnected === 'yes'
        },
      )
    }
  })
  return newProps
}

const CreateLeadPage: FC = () => {
  const [selectedMarket, setSelectedMarket] = useState<Market>(Market.Sweden)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedInsuranceType, setInsuranceType] = useState<InsuranceType>(
    ContractMarketTypes[Market.Sweden][0],
  )
  const [createLead] = useCreateLeadsMutation()
  useTitle('Tools | Create Lead')

  const form = useForm({
    shouldUnregister: true,
  })

  const insuranceFields = getFormFields(selectedInsuranceType)

  const handleSubmit = async (props: FieldValues) => {
    try {
      setLoading(true)
      const { firstName, lastName, email, phoneNumber, partnerId, ...rest } =
        props
      const data = formatDataFormProps(rest)
      await createLead({
        variables: {
          input: [
            {
              data,
              firstName,
              lastName,
              email,
              phoneNumber,
              partnerId,
              productType: selectedInsuranceType,
            },
          ],
        },
      })
      toast.success('Success!')
      form.reset()
    } catch (error) {
      toast.error('Error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Reset form when changing insurance
    if (selectedInsuranceType) {
      form.reset()
    }
  }, [selectedInsuranceType, form])

  useEffect(() => {
    // Reset insurance type
    if (selectedMarket) {
      setInsuranceType(ContractMarketTypes[selectedMarket][0])
    }
  }, [selectedMarket])

  return (
    <PageWrapper>
      <MainHeadline>💼 Create Lead</MainHeadline>
      <SecondLevelHeadline>Market</SecondLevelHeadline>
      <GapWrapper>
        {Object.values(Market).map((market) => {
          return (
            <div key={market}>
              <Checkbox
                label={`${convertEnumToTitle(market)} ${MarketFlags[market]}`}
                checked={selectedMarket === market}
                onChange={() => setSelectedMarket(market)}
              />
            </div>
          )
        })}
      </GapWrapper>

      {selectedMarket && (
        <Fragment>
          <SecondLevelHeadline>Insurance type</SecondLevelHeadline>
          <GapWrapper>
            {ContractMarketTypes[selectedMarket]
              .filter(
                (insurance) => insurance !== InsuranceType.SwedishQasaRental,
              )
              .map((insurance) => {
                return (
                  <div key={insurance}>
                    <Checkbox
                      label={convertEnumToTitle(insurance)}
                      checked={selectedInsuranceType === insurance}
                      onChange={() => {
                        if (selectedInsuranceType !== insurance) {
                          setInsuranceType(insurance)
                        }
                      }}
                    />
                  </div>
                )
              })}
          </GapWrapper>
        </Fragment>
      )}
      <SecondLevelHeadline>Partner</SecondLevelHeadline>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <GapWrapper>
            <Input
              label="Partner id"
              placeholder="55a3ecc5-cf9b-4403-b2a4-f225b142463a"
              error={!!form.formState.errors['partnerId']}
              errors={form.formState.errors}
              {...form.register('partnerId', {
                required: { value: true, message: 'Required' },
              })}
            />
          </GapWrapper>

          <SecondLevelHeadline>User</SecondLevelHeadline>
          <GapWrapper>
            <Input
              placeholder="Hedvig"
              label="First name"
              error={!!form.formState.errors['firstName']}
              errors={form.formState.errors}
              {...form.register('firstName', {
                required: { value: true, message: 'Required' },
              })}
            />
            <Input
              placeholder="Hedvigsson"
              label="Last name"
              error={!!form.formState.errors['lastName']}
              errors={form.formState.errors}
              {...form.register('lastName', {
                required: { value: true, message: 'Required' },
              })}
            />
            <Input
              placeholder="exempel@hedvig.com"
              type="email"
              label="E-mail"
              error={!!form.formState.errors['email']}
              errors={form.formState.errors}
              {...form.register('email', {
                required: { value: true, message: 'Required' },
              })}
            />
            <Input
              placeholder="0731234567"
              type="text"
              label="Phone number"
              error={!!form.formState.errors['phoneNumber']}
              errors={form.formState.errors}
              {...form.register('phoneNumber', {
                required: { value: true, message: 'Required' },
              })}
            />
          </GapWrapper>
          {selectedInsuranceType && (
            <Fragment>
              <SecondLevelHeadline>Lead</SecondLevelHeadline>
              <GapWrapper>{insuranceFields}</GapWrapper>
            </Fragment>
          )}

          <Button
            disabled={loading}
            style={{ marginTop: '1rem' }}
            type="submit"
          >
            {loading ? 'Creating lead...' : 'Submit'}
          </Button>
        </form>
      </FormProvider>
    </PageWrapper>
  )
}

export default CreateLeadPage
