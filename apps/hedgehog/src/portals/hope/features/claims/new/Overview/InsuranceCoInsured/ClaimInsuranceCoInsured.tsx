import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { section, sectionHeader, sectionTitle } from '../section.css'
import { Grid, LabeledText } from '@hedvig-ui/redesign'
import * as css from './ClaimInsuranceCoInsured.css'
import { formatSsn } from '@hedvig-ui'
import { AgreementCoInsured } from 'types/generated/graphql'

export const ClaimInsuranceCoInsured = () => {
  const { agreement } = useClaim()

  if (!agreement?.numberCoInsured) {
    return null
  }

  const numberCoInsuredWithoutInfo =
    agreement.numberCoInsured - agreement.coInsured.length

  return (
    <section className={section}>
      <div className={sectionHeader}>
        <p className={sectionTitle}>Co insured ({agreement.numberCoInsured})</p>
      </div>
      <Grid equalColumns={2} gap="sm">
        {agreement.coInsured.map((coInsured) => (
          <div key={coInsured.id} className={css.coInsuredCard}>
            <Name coInsured={coInsured} />
            <SSNOrBirthDate coInsured={coInsured} />
          </div>
        ))}

        {Array.from({ length: numberCoInsuredWithoutInfo }).map((_, index) => (
          <EmptyCoInsured key={index} />
        ))}
      </Grid>
    </section>
  )
}

const Name = ({ coInsured }: { coInsured: AgreementCoInsured }) => {
  if (coInsured.firstName && coInsured.lastName) {
    return (
      <LabeledText label="Name">
        {coInsured.firstName} {coInsured.lastName}
      </LabeledText>
    )
  }

  if (coInsured.firstName) {
    return <LabeledText label="First name">{coInsured.firstName}</LabeledText>
  }

  if (coInsured.lastName) {
    return <LabeledText label="Last name">{coInsured.lastName}</LabeledText>
  }

  return null
}

const SSNOrBirthDate = ({ coInsured }: { coInsured: AgreementCoInsured }) => {
  if (coInsured.ssn) {
    return <LabeledText label="SSN">{formatSsn(coInsured.ssn)}</LabeledText>
  }

  if (coInsured.birthdate) {
    return <LabeledText label="Birth date">{coInsured.birthdate}</LabeledText>
  }

  return null
}

const EmptyCoInsured = () => {
  return (
    <div className={css.coInsuredCard}>
      <LabeledText label="Name">No information</LabeledText>
      <LabeledText label="SSN">No information</LabeledText>
    </div>
  )
}
