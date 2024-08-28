import { DropdownInput, Flex, Grid, Input } from '@hedvig-ui/redesign'
import { PaymentOrderFormSection } from './ClaimPaymentOrderFormNew'
import { CostCategory } from '@hope/features/config/constants'
import { ClaimSubclaimFragment } from 'types/generated/graphql'
import { convertEnumToSentence } from '@hedvig-ui'

export const MiscPaymentOrderSection = ({
  subclaims,
}: {
  subclaims: ClaimSubclaimFragment[]
}): PaymentOrderFormSection => ({
  Component: () => {
    const costCategoryOptions = Object.entries(CostCategory).map(
      ([displayName, category]) => ({
        label: displayName,
        value: category,
      }),
    )
    return (
      <Flex direction={'column'} gap={'small'}>
        <Grid equalColumns={2} gap={'small'}>
          <DropdownInput
            name={'subclaimId'}
            label={'Claim type'}
            options={subclaims.map((sc) => ({
              value: sc.id,
              label: convertEnumToSentence(sc.type!),
            }))}
          />
          <DropdownInput
            name={'costCategory'}
            label={'Cost category'}
            options={costCategoryOptions}
          />
        </Grid>

        <Input label="Note" type="text" name="note" required={true} />
      </Flex>
    )
  },
  extractPayload: (data) => {
    const note = data.get('note')!.toString().trim()
    return {
      note,
    }
  },
})
