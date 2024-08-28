import { Grid } from '@hedvig-ui/redesign'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { convertEnumToTitle } from '@hedvig-ui'
import { formatDeductible } from '../util'
import { InsuranceItem, BooleanInsuranceItem } from '.'
import { Exposure } from './Exposure'

export const ClaimInsuranceDetails = () => {
  const { agreement } = useClaim()

  return (
    <Grid equalColumns={2} columnGap="small">
      <InsuranceItem label="Valid from" value={agreement?.fromDate} />
      <InsuranceItem
        label="Active to"
        value={agreement ? (agreement?.toDate ?? 'Ongoing') : null}
      />
      <Exposure
        petName={agreement?.name}
        registrationNumber={agreement?.registrationNumber}
        street={agreement?.address?.street}
      />
      <InsuranceItem
        label="Deductible"
        value={formatDeductible(
          agreement?.percentageDeductible,
          agreement?.fixedDeductible,
        )}
      />
      <InsuranceItem
        label="Race"
        value={agreement?.breeds
          ?.map((race) => convertEnumToTitle(race))
          .join(',')}
      />
      <InsuranceItem label="Birth date" value={agreement?.birthDate} />
      <InsuranceItem
        label="Gender"
        value={agreement?.gender}
        format={convertEnumToTitle}
      />
      <InsuranceItem
        label="Partner"
        value={agreement?.partner}
        format={convertEnumToTitle}
      />
      <BooleanInsuranceItem label="Neutered" value={agreement?.isNeutered} />
      <BooleanInsuranceItem
        label="Previous dog owner"
        value={agreement?.isPreviousDogOwner}
      />
      <BooleanInsuranceItem
        label="Outside access"
        value={agreement?.hasOutsideAccess}
      />
      <BooleanInsuranceItem
        label="Death option"
        value={agreement?.deathOption}
      />
      <BooleanInsuranceItem
        label="Pre-existing condition option"
        value={agreement?.preExistingConditionOption}
      />
    </Grid>
  )
}
