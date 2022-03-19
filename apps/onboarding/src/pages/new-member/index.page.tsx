import { AdditionalCoverageCard, MainCoverageCard } from './components/coverage-cards'

import type { NextPage } from 'next'
import homeImg from './assets/home.jpg'
import styled from '@emotion/styled'
import { useState } from 'react'

const CardGrid = styled.div({
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 6px',
  marginTop: 30,
  gap: 6,
})

const NewMemberPage: NextPage = () => {
  const [additionalCoverageSelected, setAdditionalCoverageSelected] = useState<boolean>(false)
  return (
    <main>
      <h1>Landing page</h1>
      <CardGrid>
        <MainCoverageCard
          selected
          cardImg={homeImg}
          title="Home Insurance"
          description="Coverage for your house or apartment contents"
          wrapperStyles={{ gridColumn: '1 / 3' }}
        />
        <AdditionalCoverageCard
          enableHover
          cardImg={homeImg}
          checked={additionalCoverageSelected}
          selected={additionalCoverageSelected}
          onCheck={() => setAdditionalCoverageSelected(!additionalCoverageSelected)}
          title="Travel Insurance "
          description="Covers you and your family when you’re traveling"
          wrapperStyles={{ gridColumn: '1 / 2' }}
        />
        <AdditionalCoverageCard
          enableHover
          cardImg={homeImg}
          checked={additionalCoverageSelected}
          selected={additionalCoverageSelected}
          onCheck={() => setAdditionalCoverageSelected(!additionalCoverageSelected)}
          title="Travel Insurance "
          description="Covers you and your family when you’re traveling"
          wrapperStyles={{ gridColumn: '2 / 3' }}
        />
      </CardGrid>
    </main>
  )
}

export default NewMemberPage
