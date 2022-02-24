import { Heading, MailIcon, PhoneIcon, Space } from 'ui'

import Image from 'next/image'
import contactCardImage from './contact-card-image.png'
import styled from '@emotion/styled'

const Wrapper = styled.div({
  padding: '0.75rem 1rem',
})

const Card = styled(Space)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  border: '1px solid',
  borderColor: theme.colors.gray300,
  boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.05)',
  padding: '1.5rem',
  borderRadius: '0.625rem',
}))

const Header = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const Title = styled.div({})

const SubTitle = styled.p(({ theme }) => ({
  fontSize: '1rem',
  margin: 0,
  color: theme.colors.gray500,
}))

const StyledImage = styled(Image)({
  borderRadius: '48rem',
})

const InfoRow = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const InfoLabel = styled.p(({ theme }) => ({
  fontSize: '0.875rem',
  margin: 0,
  color: theme.colors.gray700,
}))

export const ContactCard = () => {
  return (
    <Wrapper>
      <Card y={1}>
        <Header x={1}>
          <StyledImage src={contactCardImage} height={48} width={48} alt="Picture of agent" />
          <Title>
            <Heading headingLevel="h3" variant="xs" colorVariant="dark">
              Claire
            </Heading>
            <SubTitle>General Insurance Agent</SubTitle>
          </Title>
        </Header>

        <Space y={0.5}>
          <InfoRow x={0.5}>
            <PhoneIcon height={16} width={16} />
            <InfoLabel>+46 (0)7 350 20 00</InfoLabel>
          </InfoRow>

          <InfoRow x={0.5}>
            <MailIcon height={16} width={16} />
            <InfoLabel>claire@hedvigsupport.com</InfoLabel>
          </InfoRow>
        </Space>
      </Card>
    </Wrapper>
  )
}
