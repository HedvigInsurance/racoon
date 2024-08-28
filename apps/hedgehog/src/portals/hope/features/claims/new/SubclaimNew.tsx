import { Copyable, Flex, FourthLevelHeadline, Label, Spacing } from '@hedvig-ui'
import { Card, Grid } from '@hedvig-ui/redesign'
import { getCarrierText } from '@hope/features/contracts/utils'
import * as React from 'react'
import { ClaimSubclaimFragment } from 'types/generated/graphql'
import { useClaim } from '../hooks/use-claim'
import { theme } from '@hedvig-ui/redesign/theme'
import { SubclaimTypeNew } from './SubclaimTypeNew'
import { SubclaimOutcomeDropdownNew } from './SubclaimOutcomeDropdownNew'
import { SubclaimCauseNew } from './SubclaimCauseNew'

export const SubclaimNew: React.FC<{
  subclaim: ClaimSubclaimFragment
}> = ({ subclaim }) => {
  const { agreement } = useClaim()
  const carrier = agreement?.carrier

  return (
    <Flex direction="column" gap="medium">
      <Grid equalColumns={2} gap="medium">
        <Card>
          <Flex justify={'space-between'}>
            <Flex direction={'column'}>
              <FourthLevelHeadline>Basic info</FourthLevelHeadline>
              <Spacing top="small" />
              <Label>Subclaim Id</Label>
              <Copyable iconValue={subclaim.id} />
              <Spacing top="small" />
            </Flex>
            {carrier && (
              <span style={{ fontSize: theme.fontSizes.xxl }}>
                {getCarrierText(carrier)}
              </span>
            )}
          </Flex>

          <Spacing top="small" />

          <SubclaimTypeNew subclaimId={subclaim.id} />
        </Card>
        <Card>
          <Flex
            style={{ height: '100%' }}
            direction="column"
            align={'stretch'}
            gap="small"
            justify="space-between"
          >
            <SubclaimOutcomeDropdownNew subclaimId={subclaim.id} />
            <SubclaimCauseNew subclaimId={subclaim.id} />
          </Flex>
        </Card>
      </Grid>
    </Flex>
  )
}
