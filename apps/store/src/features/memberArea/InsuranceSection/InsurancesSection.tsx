import styled from '@emotion/styled'
import { useState } from 'react'
import { Heading, mq, theme } from 'ui'
import { MemberContractFragment } from '@/services/apollo/generated'
import { useMemberAreaInfo } from '../useMemberAreaInfo'
import { InsuranceCard } from './InsuranceCard'
import { InsuranceDetails } from './InsuranceDetails'

export const Insurances = () => {
  const currentMember = useMemberAreaInfo()
  const greeting = `Hello, ${currentMember.firstName} ${currentMember.lastName}`
  const [displayedContract, setDisplayedContract] = useState<null | MemberContractFragment>(null)

  const handleClick = (contract: MemberContractFragment) => {
    setDisplayedContract(contract)
  }
  return (
    <>
      {!displayedContract && (
        <>
          <Heading as={'h2'} variant="standard.32">
            {greeting}
          </Heading>
          <Heading as="h1" variant="standard.32">
            Your insurances
          </Heading>
          <Grid>
            {currentMember.activeContracts.map((contract) => (
              <InuranceButton key={contract.id} onClick={() => handleClick(contract)}>
                <InsuranceCard contract={contract} />
              </InuranceButton>
            ))}
          </Grid>
        </>
      )}

      {displayedContract && <InsuranceDetails contract={displayedContract} />}
    </>
  )
}

const Grid = styled.div({
  display: 'grid',
  gridGap: theme.space.md,
  marginTop: '1rem',

  [mq.lg]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.space.xl,
    marginRight: theme.space.xl,
  },
})

export const InuranceButton = styled.button({
  cursor: 'pointer',
})
