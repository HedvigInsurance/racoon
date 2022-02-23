import { Heading, InsuranceIcon, MailIcon, Space } from 'ui'

import Image from 'next/image'
import styled from '@emotion/styled'

const Wrapper = styled.div({
  width: '100%',
  padding: '0.75rem 1rem',
})

const Header = styled(Space)({})

const Text = styled.p(({ theme }) => ({
  color: theme.colors.gray700,
}))

const InfoRow = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const InfoLabel = styled.p(({ theme }) => ({
  color: theme.colors.gray900,
  fontSize: '1rem',
  margin: '0 0 0 1rem',
}))

const InfoDescription = styled.p(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.colors.gray700,
  margin: 0,
}))

export const Benefits = () => {
  return (
    <Wrapper>
      <Header x={1}>
        <Heading headingLevel="h3" variant="s" colorVariant="dark">
          Why you will love Hedvig
        </Heading>
      </Header>

      <Text>
        Home owners insurance is for you who who rent or own an apartment, rent a room or live in a
        detachedd house. The insurance covers up to 6 people, your apartment, your stuff, both at
        home and on the go. Drulle insurance and travel protection are included.
      </Text>

      <Space y={1.5}>
        <InfoRow x={1}>
          <InsuranceIcon height={32} width={32} />
          <InfoLabel>
            Drulle included
            <InfoDescription>Lorem ipsum dolor sit amet, consectetur ipsum.</InfoDescription>
          </InfoLabel>
        </InfoRow>

        <InfoRow x={1}>
          <InsuranceIcon height={32} width={32} />
          <InfoLabel>
            Smooth claim, fast payouts
            <InfoDescription>Lorem ipsum dolor sit amet, consectetur ipsum.</InfoDescription>
          </InfoLabel>
        </InfoRow>

        <InfoRow x={1}>
          <InsuranceIcon height={32} width={32} />
          <InfoLabel>
            Instant help
            <InfoDescription>Lorem ipsum dolor sit amet, consectetur ipsum.</InfoDescription>
          </InfoLabel>
        </InfoRow>
      </Space>
    </Wrapper>
  )
}
