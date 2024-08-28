import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { section, sectionHeader, sectionTitle } from '../section.css'
import { ClaimInsuranceDetails } from './components'
import { ContractPicker } from './components/ContractPicker/ContractPicker'
import { Button, Div, Flex, Grid } from '@hedvig-ui/redesign'
import { Modal } from '@hedvig-ui'
import { useState } from 'react'
import { ValuationTableComponent } from '@hope/pages/tools/ValuationTablesPage'
import { ValuationTableFragment } from 'types/generated/graphql'
import { useClaimItems } from '@hope/features/claims/claim-details/ClaimItems/useClaimItems'

export const ClaimInsurance = () => {
  return (
    <section className={section}>
      <div className={sectionHeader}>
        <p className={sectionTitle}>Insurance details</p>
      </div>

      <Flex direction="column" gap="md">
        <ContractPicker />

        <AgreementWarning />

        <TermsLinks />

        <ClaimInsuranceDetails />
      </Flex>
    </section>
  )
}

const AgreementWarning = () => {
  const { contract, agreement } = useClaim()

  if (contract && !agreement) {
    return <div>⚠️ No agreement covers the claim on the date of loss</div>
  }
  if (agreement?.typeOfContract.includes('QASA'))
    return (
      <div>
        ⚠️ Make sure the member has claimed with their regular home insurance
      </div>
    )

  return null
}

const TermsLinks = () => {
  const { agreement } = useClaim()
  const termsLink = agreement?.termsAndConditions?.url
  const valuationTable = agreement?.valuationTable

  if (!termsLink && !valuationTable) {
    return null
  }

  return (
    <>
      <Grid equalColumns={2} gap="sm">
        {!!termsLink && (
          <Button
            variant="secondary"
            onClick={() => {
              window.open(termsLink, '_blank', 'noopener noreferrer')
            }}
          >
            Terms
          </Button>
        )}
        <ValuationTable valuationTable={valuationTable} />
      </Grid>
    </>
  )
}

const ValuationTable = ({
  valuationTable,
}: {
  valuationTable: ValuationTableFragment | null | undefined
}) => {
  const { items } = useClaim()
  const { itemAge } = useClaimItems()
  const [showValuationTable, setShowValuationTable] = useState(false)

  if (!valuationTable) {
    return null
  }
  return (
    <>
      <Button variant="secondary" onClick={() => setShowValuationTable(true)}>
        Valuation table
      </Button>
      <Modal
        visible={showValuationTable}
        onClose={() => setShowValuationTable(false)}
      >
        <Div p="md">
          <ValuationTableComponent
            valuationTable={valuationTable}
            highlights={items.map((item) => ({
              itemAge: itemAge(item),
              itemType: item.type,
            }))}
          />
        </Div>
      </Modal>
    </>
  )
}
