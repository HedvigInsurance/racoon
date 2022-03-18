
import type { NextPage } from 'next'
import { useState } from 'react'
import homeImg from './assets/home.jpg'
import { AdditionalCoverageCard, MainCoverageCard } from './components/coverage-cards'

const NewMemberPage: NextPage = () => {
  const [additionalCoverageSelected, setAdditionalCoverageSelected] = useState<boolean>(false)
  return (
    <main>
      <h1>Landing page</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MainCoverageCard
          selected
          cardImg={homeImg}
          title="Home Insurance"
          description="Coverage for your house or apartment contents"
        />
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}
      >
        <AdditionalCoverageCard
          enableHover
          cardImg={homeImg}
          checked={additionalCoverageSelected}
          selected={additionalCoverageSelected}
          onCheck={() => setAdditionalCoverageSelected(!additionalCoverageSelected)}
          title="Travel Insurance "
          description="Covers you and your family when you’re traveling"
        />
      </div>
    </main>
  )
}

export default NewMemberPage
