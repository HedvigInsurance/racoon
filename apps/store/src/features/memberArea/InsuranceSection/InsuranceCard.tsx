import styled from '@emotion/styled'
import { HedvigSymbol, Text, theme } from 'ui'
import { MemberContractFragment } from '@/services/apollo/generated'

type InsuranceCardProps = {
  contract: MemberContractFragment
}

export const InsuranceCard = ({ contract }: InsuranceCardProps) => {
  const { currentAgreement, exposureDisplayName } = contract

  return (
    <Card>
      <CardHeader>
        <HedvigSymbol size="1.5rem" />
      </CardHeader>
      <Info>
        <Text size="md" color="textNegative">
          {currentAgreement.productVariant.displayName}
        </Text>
        <Exposure>{exposureDisplayName}</Exposure>
      </Info>
      <PillowBackground imgSrc={getPillowSrc(currentAgreement.productVariant.typeOfContract)} />
    </Card>
  )
}

const Card = styled.div({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  maxWidth: '400px',
  aspectRatio: '343/182',
  padding: `1.125rem ${theme.space.md}`,
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.md,
  boxShadow: theme.shadow.default,
  isolation: 'isolate',
})

const CardHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

const Exposure = styled.div({
  color: theme.colors.grayTranslucentDark500,
})

const PillowBackground = styled.div<{ imgSrc: string }>(({ imgSrc }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '130%',
  aspectRatio: '1/1',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  filter: 'blur(20px)',
  backgroundImage: `url('${imgSrc}')`,
  zIndex: -1,
  pointerEvents: 'none',
  transition: 'all 0.2s ease-in-out',

  '@media (hover: hover)': {
    [`a:hover &`]: {
      filter: 'blur(50px)',
      transform: 'scale(1.1) translate(-50%, -50%)',
    },
  },
}))

const Info = styled.div({
  marginTop: 'auto',
})

const getPillowSrc = (typeOfContract: string) => {
  switch (typeOfContract) {
    case 'SE_HOUSE':
      return 'https://a.storyblok.com/f/165473/832x832/a50cf6d846/hedvig-pillows-house-villa.png'
    case 'SE_APARTMENT_RENT':
      return 'https://a.storyblok.com/f/165473/832x832/fb3ddd4632/hedvig-pillows-rental.png'
    case 'SE_APARTMENT_BRF':
      return 'https://a.storyblok.com/f/165473/832x832/f98d88ac63/hedvig-pillows-homeowner.png'
    case 'SE_ACCIDENT':
      return 'https://a.storyblok.com/f/165473/832x832/1bb4813dd1/hedvig-pillows-accident.png'
    case 'SE_CAR_FULL':
    case 'SE_CAR_HALF':
    case 'SE_CAR_TRAFFIC':
      return 'https://a.storyblok.com/f/165473/832x832/1fe7a75de6/hedvig-pillows-car.png'
    case 'SE_DOG_BASIC':
    case 'SE_DOG_STANDARD':
    case 'SE_DOG_PREMIUM':
      return 'https://a.storyblok.com/f/165473/832x832/d19b86f8c4/hedvig-pillows-dog.png'
    case 'SE_CAT_BASIC':
    case 'SE_CAT_STANDARD':
    case 'SE_CAT_PREMIUM':
      return 'https://a.storyblok.com/f/165473/832x832/a61cfbf4ae/hedvig-pillows-cat.png'
    default:
      return 'https://a.storyblok.com/f/165473/832x832/cdaaa91242/hedvig-pillows-home.png'
  }
}
