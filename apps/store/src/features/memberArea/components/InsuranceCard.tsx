import styled from '@emotion/styled'
import { Text, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { MemberContractFragment } from '@/services/apollo/generated'
import { TravelCertificateButton } from './TravelCertificateButton'

type InsuranceCardProps = {
  contract: MemberContractFragment
}

export const InsuranceCard = ({ contract }: InsuranceCardProps) => {
  const { currentAgreement, exposureDisplayName } = contract

  return (
    <Card>
      <Info>
        <Text size="md" color="textNegative">
          {currentAgreement.productVariant.displayName}
        </Text>
        <Text color="textTranslucentTertiary">{exposureDisplayName}</Text>
        {currentAgreement.certificateUrl && (
          <ButtonNextLink href={currentAgreement.certificateUrl} variant="secondary" size="small">
            Insurance certificate
          </ButtonNextLink>
        )}
        <TravelCertificateButton contractId={contract.id} />
      </Info>
      <PillowBackground />
    </Card>
  )
}

const Card = styled.div({
  display: 'flex',
  position: 'relative',
  overflow: 'hidden',
  minHeight: '182px',
  maxWidth: '343px',
  padding: `1.125rem ${theme.space.md}`,
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.md,
  boxShadow: theme.shadow.default,
  isolation: 'isolate',
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
})

const Info = styled.div({
  marginTop: 'auto',
})
