import { MainCoverageCard } from './components/Cards'
import type { NextPage } from 'next'

const NewMemberPage: NextPage = () => {
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
    </main>
  )
}

export default NewMemberPage
