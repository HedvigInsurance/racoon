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
        <Text color="textTranslucentTertiary">{exposureDisplayName}</Text>
      </Info>
      <PillowBackground />
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

const PillowBackground = styled.div({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '130%',
  aspectRatio: '1/1',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  filter: 'blur(20px)',
  backgroundImage: `url('https://a.storyblok.com/f/165473/832x832/fa27811442/hedvig-pillow-home.png')`,
  zIndex: -1,
  pointerEvents: 'none',
  transition: 'filter 0.2s ease-in-out',

  '@media (hover: hover)': {
    [`button:hover &`]: {
      filter: 'blur(50px)',
    },
  },
})

const Info = styled.div({
  marginTop: 'auto',
})
