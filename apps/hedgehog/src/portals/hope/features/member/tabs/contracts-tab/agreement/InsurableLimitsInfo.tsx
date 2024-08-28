import { useState } from 'react'
import { Collapsible, Label, Select } from '@hedvig-ui'
import { Grid, Hr } from '@hedvig-ui/redesign'
import { ExpandToggler } from '@hope/features/claims/new/Overview/ExpandToggler'
import {
  ClaimInsurableLimitsDetails,
  TotalInsurableLimits,
} from '@hope/features/claims/new/Overview/InsurableLimits'
import { section, sectionHeader, sectionTitle } from './InsurableLimitsInfo.css'
import { Contract } from 'types/generated/graphql'

export const InsurableLimitsInfo: React.FC<{
  contract: Contract
}> = ({ contract }) => {
  const { insurableLimits: insurableLimitsList } = contract
  const [showInsuranceLimits, setShowInsuranceLimits] = useState(false)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)

  const toggleShowInsuranceLimits = () =>
    setShowInsuranceLimits((prev) => !prev)

  if (insurableLimitsList.length === 0) {
    return null
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOptionIndex(parseInt(event.target.value))
  }
  return (
    <section className={section}>
      <div>
        <p className={sectionTitle}>Insurable limits</p>
      </div>
      <div>
        <Label>Contract Period</Label>
        <Select
          options={insurableLimitsList.map((insurableLimits, index) => ({
            label: insurableLimits.description,
            value: index.toString(),
            text: insurableLimits.description,
          }))}
          value={selectedOptionIndex.toString()}
          onChange={handleSelectChange}
        ></Select>
      </div>
      <div className={sectionHeader} onClick={toggleShowInsuranceLimits}>
        <p className={sectionTitle}>Details</p>
        <ExpandToggler active={showInsuranceLimits} />
      </div>

      <TotalInsurableLimits
        insurableLimits={insurableLimitsList[selectedOptionIndex]}
      />

      <Collapsible collapsed={!showInsuranceLimits}>
        <Grid mt="medium" rowGap="medium">
          <Hr />
          <ClaimInsurableLimitsDetails
            insurableLimits={insurableLimitsList[selectedOptionIndex]}
          />
        </Grid>
      </Collapsible>
    </section>
  )
}
