import { Grid, Card, Flex } from '@hedvig-ui/redesign'
import { ClaimInformation } from './Information'
import { ClaimMember } from './Member'
import { ClaimInsurance } from './Insurance'
import { ClaimInsurableLimits } from './InsurableLimits'
import { ClaimInsuranceCoInsured } from './InsuranceCoInsured'

export const ClaimDetails = () => {
  return (
    <Grid equalColumns={2} columnGap="medium">
      <Card>
        <Flex direction="column" gap="medium" align="stretch">
          <ClaimMember />
          <ClaimInsurance />
          <ClaimInsuranceCoInsured />
          <ClaimInsurableLimits />
        </Flex>
      </Card>
      <Card>
        <ClaimInformation />
      </Card>
    </Grid>
  )
}
