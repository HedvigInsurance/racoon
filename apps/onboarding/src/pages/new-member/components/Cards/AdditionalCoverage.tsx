import BaseCard from './Base'
import homeImg from '../../assets/home.jpg'

const AdditionalCoverageCard = () => {
  return (
    <BaseCard
      selected
      cardImg={homeImg}
      title="Home Insurance"
      description="Coverage for your house or apartment contents"
    />
  )
}

export default AdditionalCoverageCard
